import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model, ClientSession, startSession } from 'mongoose';
import { CartService } from '../cart/cart.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>, private cartService: CartService) {}

  async placeOrderFromCart(cartId: string, paymentMethod: string, shippingAddress: any) {
    // Load cart
    const cart = await this.cartService.recalc(cartId);
    // Basic checks
    if (!cart || !cart.items || cart.items.length === 0) throw new BadRequestException('Cart empty');

    // Start transaction: decrement inventory, create order, create payment stub, loyalty tx, etc.
    const session: ClientSession = await (this.orderModel.db as any).startSession();
    session.startTransaction();
    try {
      // Create order snapshot
      const orderNumber = `ORD-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`;
      const order = await this.orderModel.create(
        [
          {
            orderNumber,
            userId: cart.userId,
            items: cart.items,
            subtotal: cart.subtotal,
            discounts: cart.discounts,
            couponCode: cart.couponCode,
            couponDiscountAmount: cart.couponDiscountAmount,
            deliveryFee: cart.deliveryFee,
            tax: cart.tax,
            total: cart.total,
            currency: cart.currency,
            paymentMethod,
            shippingAddress,
            placedAt: new Date(),
            paymentStatus: 'pending',
            fulfillmentStatus: 'pending',
          },
        ],
        { session },
      );

      // TODO: decrement variant.stock and create inventory transactions; require ProductVariant model import
      // TODO: call payment provider and update paymentStatus

      // Clear cart contents
      // Note: For simplicity we will remove cart document; production should keep cart and mark checked out
      await (this.cartService as any).cartModel.findByIdAndDelete(cart._id).session(session);

      await session.commitTransaction();
      session.endSession();

      return order[0];
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  async findByOrderNumber(orderNumber: string) {
    return this.orderModel.findOne({ orderNumber }).exec();
  }
}