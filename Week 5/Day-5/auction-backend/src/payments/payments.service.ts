// payments.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  create(payment: Partial<Payment>) {
    const newPayment = new this.paymentModel(payment);
    return newPayment.save();
  }

  findAll() {
    return this.paymentModel
      .find()
      .populate('auctionId')
      .populate('buyerId')
      .exec();
  }
}
