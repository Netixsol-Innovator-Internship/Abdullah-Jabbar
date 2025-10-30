
// cart.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model, Types } from 'mongoose';
import Decimal from 'decimal.js';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  async getCartForUser(userId?: string | Types.ObjectId, sessionId?: string) {
    if (userId) {
      let cart = await this.cartModel
        .findOne({ userId })
        .populate('items.productId')
        .exec();
      if (!cart) {
        cart = await this.cartModel.create({ userId, items: [] });
      }
      return cart;
    }
    if (sessionId) {
      let cart = await this.cartModel
        .findOne({ sessionId })
        .populate('items.productId')
        .exec();
      if (!cart) {
        cart = await this.cartModel.create({ sessionId, items: [] });
      }
      return cart;
    }
    throw new NotFoundException('userId or sessionId required');
  }

  async addToCart(
    userId: string | Types.ObjectId | undefined,
    sessionId: string | undefined,
    item: {
      productId: string;
      quantity: number;
      selectedOptions?: Record<string, any>;
    },
  ) {
    const cart = await this.getCartForUser(userId, sessionId);

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (cartItem) => cartItem.productId?.toString() === item.productId,
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      cart.items[existingItemIndex].qty += item.quantity || 1;
    } else {
      // Add new item to cart
      cart.items.push({
        productId: new Types.ObjectId(item.productId),
        qty: item.quantity || 1,
        selectedOptions: item.selectedOptions || {},
        addedAt: new Date(),
      } as any);
    }

    await cart.save();
    if (cart._id) {
      await this.recalc(cart._id.toString());
    }
    return this.getCartForUser(userId, sessionId);
  }

  async updateCartItem(
    userId: string | Types.ObjectId | undefined,
    sessionId: string | undefined,
    itemId: string,
    quantity: number,
  ) {
    const cart = await this.getCartForUser(userId, sessionId);
    const itemIndex = cart.items.findIndex(
      (item) => item.productId?.toString() === itemId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    if (quantity <= 0) {
      return this.removeFromCart(userId, sessionId, itemId);
    }

    cart.items[itemIndex].qty = quantity;
    await cart.save();
    if (cart._id) {
      await this.recalc(cart._id.toString());
    }
    return this.getCartForUser(userId, sessionId);
  }

  async removeFromCart(
    userId: string | Types.ObjectId | undefined,
    sessionId: string | undefined,
    itemId: string,
  ) {
    const cart = await this.getCartForUser(userId, sessionId);
    const itemIndex = cart.items.findIndex(
      (item) => item.productId?.toString() === itemId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    if (cart._id) {
      await this.recalc(cart._id.toString());
    }
    return this.getCartForUser(userId, sessionId);
  }

  async clearCart(
    userId: string | Types.ObjectId | undefined,
    sessionId: string | undefined,
  ) {
    const cart = await this.getCartForUser(userId, sessionId);
    cart.items = [];
    await cart.save();
    return { success: true };
  }

  // Legacy methods - keeping for backward compatibility
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
    const unitPrice = cart.items[index].unitPrice
      ? new Decimal((cart.items[index].unitPrice as any).toString())
      : new Decimal(0);
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
      const up = it.unitPrice
        ? new Decimal((it.unitPrice as any).toString())
        : new Decimal(0);
      subtotal = subtotal.add(up.mul(it.qty));
    }
    cart.subtotal = subtotal.toNumber() as any;
    // basic discount calculation already stored in couponDiscountAmount
    const discounts = cart.couponDiscountAmount
      ? new Decimal((cart.couponDiscountAmount as any).toString())
      : new Decimal(0);
    cart.discounts = discounts.toNumber() as any;
    const delivery = cart.deliveryFee
      ? new Decimal((cart.deliveryFee as any).toString())
      : new Decimal(0);
    cart.total = subtotal.sub(discounts).add(delivery).toNumber() as any;
    await cart.save();
    return cart;
  }
}
