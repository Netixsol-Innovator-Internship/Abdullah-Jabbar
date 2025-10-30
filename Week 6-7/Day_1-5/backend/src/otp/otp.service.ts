import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from './schemas/otp.schema';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  private logger = new Logger(OtpService.name);

  private OTP_LENGTH = Number(process.env.OTP_LENGTH || 6);
  private OTP_EXPIRES_MINUTES = Number(process.env.OTP_EXPIRES_MINUTES || 10);
  private OTP_REQUEST_COOLDOWN_SECONDS = Number(
    process.env.OTP_REQUEST_COOLDOWN_SECONDS || 60,
  );
  private MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);

  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
    private readonly mailService: MailService,
  ) {}

  private generateCode() {
    const max = 10 ** this.OTP_LENGTH;
    const min = Math.floor(10 ** (this.OTP_LENGTH - 1));
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return String(num).padStart(this.OTP_LENGTH, '0');
  }

  private hash(code: string) {
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  async requestOtp(email: string) {
    const now = new Date();

    // find most recent OTP for email
    const recent = await this.otpModel
      .findOne({ email })
      .sort({ createdAt: -1 })
      .exec();

    if (recent && recent.createdAt) {
      const secondsSinceLast =
        (now.getTime() - recent.createdAt.getTime()) / 1000;
      if (secondsSinceLast < this.OTP_REQUEST_COOLDOWN_SECONDS) {
        throw new BadRequestException(
          `Please wait ${Math.ceil(
            this.OTP_REQUEST_COOLDOWN_SECONDS - secondsSinceLast,
          )}s before requesting a new OTP.`,
        );
      }
    }

    const code = this.generateCode();
    const codeHash = this.hash(code);
    const expiresAt = new Date(
      now.getTime() + this.OTP_EXPIRES_MINUTES * 60 * 1000,
    );

    // mark previous OTP as used (optional)
    if (recent && !recent.used) {
      recent.used = true;
      await recent.save();
    }

    const created = new this.otpModel({
      email,
      codeHash,
      expiresAt,
      used: false,
      attempts: 0,
    });

    await created.save();

    // send email
    const subject = 'Your verification code';
    const html = `<p>Your verification code is: <b style="font-size:20px">${code}</b></p><p>This code expires in ${this.OTP_EXPIRES_MINUTES} minutes.</p>`;

    try {
      await this.mailService.sendMail(email, subject, html);
      if (process.env.LOG_OTP_CODES === 'true') {
        this.logger.debug(`OTP for ${email}: ${code}`);
      }
    } catch (err) {
      this.logger.error('Failed to send OTP email', err);
      // remove created OTP to avoid orphaned valid codes
      try {
        await this.otpModel.deleteOne({ _id: created._id }).exec();
      } catch (_) {}
      throw new BadRequestException(
        'Failed to send OTP email. Check SMTP settings.',
      );
    }

    // Generic success message to avoid leaking whether an email exists
    return { success: true, message: 'OTP sent if the email exists.' };
  }

  async verifyOtp(email: string, code: string) {
    const otp = await this.otpModel
      .findOne({ email })
      .sort({ createdAt: -1 })
      .exec();

    if (!otp) {
      throw new NotFoundException('No OTP found for this email.');
    }
    if (otp.used) {
      throw new BadRequestException('This OTP has already been used.');
    }
    if (new Date() > new Date(otp.expiresAt)) {
      throw new BadRequestException('OTP has expired.');
    }
    if ((otp.attempts ?? 0) >= this.MAX_ATTEMPTS) {
      throw new BadRequestException('Too many failed attempts.');
    }

    const incomingHash = this.hash(code);
    if (incomingHash !== otp.codeHash) {
      otp.attempts = (otp.attempts ?? 0) + 1;
      await otp.save();
      throw new BadRequestException('Invalid OTP.');
    }

    otp.used = true;
    await otp.save();

    return { success: true, message: 'OTP verified.' };
  }

  // optional helper if you want to manually remove expired docs (Mongo TTL index already handles deletion)
  async removeExpiredManually() {
    await this.otpModel.deleteMany({ expiresAt: { $lte: new Date() } }).exec();
  }
}
