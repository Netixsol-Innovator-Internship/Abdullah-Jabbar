import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model, Types } from 'mongoose';
import Decimal from 'decimal.js';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  async getCartForUser(userId?: string | Types.ObjectId, sessionId?: string) {
    if (userId) {
      let cart = await this.cartModel.findOne({ userId }).exec();
      if (!cart) {
        cart = await this.cartModel.create({ userId, items: [] });
      }
      return cart;
    }
    if (sessionId) {
      let cart = await this.cartModel.findOne({ sessionId }).exec();
      if (!cart) {
        cart = await this.cartModel.create({ sessionId, items: [] });
      }
      return cart;
    }
    throw new NotFoundException('userId or sessionId required');
  }

  async addItem(cartId: string, line: any) {
    const cart = await this.cartModel.findById(cartId);
    if (!cart) throw new NotFoundException('cart not found');
    cart.items.push({
      variantId: line.variantId,
      productId: line.productId,
      title: line.title,
      sku: line.sku,
      qty: line.qty || 1,
      unitPrice: line.unitPrice,
      unitPointsPrice: line.unitPointsPrice,
      selectedOptions: line.selectedOptions || {},
      lineDiscount: line.lineDiscount || 0,
      lineTotal: line.lineTotal || line.qty * (line.unitPrice || 0),
    } as any);
    await cart.save();
    return cart;
  }

  async updateItemQty(cartId: string, index: number, qty: number) {
    const cart = await this.cartModel.findById(cartId);
    if (!cart) throw new NotFoundException('cart not found');
    if (!cart.items[index]) throw new NotFoundException('item not found');
    cart.items[index].qty = qty;
    // recompute lineTotal conservatively
    const unitPrice = cart.items[index].unitPrice ? new Decimal((cart.items[index].unitPrice as any).toString()) : new Decimal(0);
    cart.items[index].lineTotal = unitPrice.mul(qty).toNumber() as any;
    await cart.save();
    return cart;
  }

  async removeItem(cartId: string, index: number) {
    const cart = await this.cartModel.findById(cartId);
    if (!cart) throw new NotFoundException('cart not found');
    cart.items.splice(index, 1);
    await cart.save();
    return cart;
  }

  async recalc(cartId: string) {
    const cart = await this.cartModel.findById(cartId);
    if (!cart) throw new NotFoundException('cart not found');
    let subtotal = new Decimal(0);
    for (const it of cart.items) {
      const up = it.unitPrice ? new Decimal((it.unitPrice as any).toString()) : new Decimal(0);
      subtotal = subtotal.add(up.mul(it.qty));
    }
    cart.subtotal = subtotal.toNumber() as any;
    // basic discount calculation already stored in couponDiscountAmount
    const discounts = cart.couponDiscountAmount ? new Decimal((cart.couponDiscountAmount as any).toString()) : new Decimal(0);
    cart.discounts = discounts.toNumber() as any;
    const delivery = cart.deliveryFee ? new Decimal((cart.deliveryFee as any).toString()) : new Decimal(0);
    cart.total = subtotal.sub(discounts).add(delivery).toNumber() as any;
    await cart.save();
    return cart;
  }
}