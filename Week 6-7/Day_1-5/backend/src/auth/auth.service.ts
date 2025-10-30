
// auth.service.ts

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/user-role.enum';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from '../otp/otp.service';
import * as bcrypt from 'bcrypt';

interface PublicUser {
  _id: string;
  email: string;
  roles?: UserRole[];
  name?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async validateUser(email: string, pass: string): Promise<PublicUser | null> {
    const userDoc = await this.usersService.findByEmail(email);
    if (!userDoc) {
      // User doesn't exist
      return null;
    }

    // Check if user has a password (OAuth users might not have one)
    if (!userDoc.passwordHash) {
      // This is likely an OAuth-only user, they can't login with password
      return null;
    }

    const valid = await bcrypt.compare(pass, userDoc.passwordHash);
    if (!valid) {
      // Wrong password
      return null;
    }

    // Check if email is verified
    if (
      !(userDoc as unknown as { isEmailVerified?: boolean }).isEmailVerified
    ) {
      // Email not verified - return null to block login
      return null;
    }

    // Controlled conversion to plain object (Mongoose) - limited trusted casting.
    const rawObj = userDoc as unknown as {
      _id: unknown;
      email: unknown;
      roles?: UserRole[];
      name?: unknown;
    };

    const safe: PublicUser = {
      _id: String(rawObj._id as string),
      email: String(rawObj.email as string),
      roles: rawObj.roles || [UserRole.USER],
      name: rawObj.name ? String(rawObj.name as string) : undefined,
    };
    return safe;
  }

  login(user: PublicUser) {
    const payload = {
      sub: user._id,
      email: user.email,
      roles: user.roles || [UserRole.USER],
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  // Refresh token - generate a new token for an existing valid user
  refreshToken(user: PublicUser) {
    const payload = {
      sub: user._id,
      email: user.email,
      roles: user.roles || [UserRole.USER],
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  // Simple register helper
  async register(payload: {
    email: string;
    password: string;
    name?: string;
    roles?: UserRole[];
    otp: string;
  }) {
    const existing = await this.usersService.findByEmail(payload.email);
    if (existing) {
      if (!existing.isEmailVerified) {
        // allow retry of registration if previous attempt left unverified user record? We choose to block to avoid confusion.
        throw new BadRequestException('Email already in use');
      }
      throw new BadRequestException('Email already in use');
    }
    if (!payload.otp) throw new BadRequestException('OTP required');
    try {
      await this.otpService.verifyOtp(payload.email, payload.otp);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid OTP';
      throw new BadRequestException(msg);
    }
    const passwordHash = await bcrypt.hash(payload.password, 10);
    const userDoc = await this.usersService.create({
      email: payload.email,
      passwordHash,
      name: payload.name,
      roles: payload.roles,
      isEmailVerified: true,
    });
    return this.login({
      _id: String(userDoc._id),
      email: userDoc.email,
      roles: userDoc.roles as UserRole[],
      name: userDoc.name,
    });
  }

  async preRegister(email: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }
    await this.otpService.requestOtp(email);
    return { success: true, message: 'OTP sent to email if not registered.' };
  }

  async verifyEmail(payload: { email: string; otp: string }) {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) throw new NotFoundException('User not found');
    if (user.isEmailVerified) {
      return {
        alreadyVerified: true,
        ...this.login({
          _id: String(user._id),
          email: user.email,
          roles: user.roles,
          name: user.name,
        }),
      };
    }
    try {
      await this.otpService.verifyOtp(payload.email, payload.otp);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid OTP';
      throw new BadRequestException(msg);
    }
    user.isEmailVerified = true;
    await user.save();
    return this.login({
      _id: String(user._id),
      email: user.email,
      roles: user.roles,
      name: user.name,
    });
  }

  async validateOrCreateOAuthUser(oauthData: {
    email: string;
    name: string;
    provider: string;
    providerId: string;
    picture?: string;
  }): Promise<PublicUser> {
    // Check if user exists with this email
    let user = await this.usersService.findByEmail(oauthData.email);

    if (user) {
      // User exists, update OAuth info if needed
      const userObj = user as unknown as {
        _id: unknown;
        email: unknown;
        roles?: UserRole[];
        name?: unknown;
        oauthProviders?: Array<{
          provider: string;
          providerId: string;
        }>;
      };

      // Check if this OAuth provider is already linked
      const existingProvider = userObj.oauthProviders?.find(
        (p) =>
          p.provider === oauthData.provider &&
          p.providerId === oauthData.providerId,
      );

      if (!existingProvider) {
        // Add this OAuth provider to the user
        if (!userObj.oauthProviders) {
          userObj.oauthProviders = [];
        }
        userObj.oauthProviders.push({
          provider: oauthData.provider,
          providerId: oauthData.providerId,
        });
        await user.save();
      }
    } else {
      // Create new user with OAuth data
      user = await this.usersService.create({
        email: oauthData.email,
        name: oauthData.name,
        isEmailVerified: true, // OAuth emails are pre-verified
        roles: [UserRole.USER],
        oauthProviders: [
          {
            provider: oauthData.provider,
            providerId: oauthData.providerId,
          },
        ],
        picture: oauthData.picture,
      });
    }

    return {
      _id: String(user._id),
      email: user.email,
      roles: user.roles || [UserRole.USER],
      name: user.name,
    };
  }
}