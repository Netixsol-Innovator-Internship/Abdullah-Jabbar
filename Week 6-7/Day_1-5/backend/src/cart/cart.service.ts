
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
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) public cartModel: Model<CartDocument>,
    private productsService: ProductsService,
  ) {}

  async getCartForUser(userId?: string | Types.ObjectId, sessionId?: string) {
    // getCartForUser called

    if (userId) {
      let cart = await this.cartModel
        .findOne({ userId })
        .populate('items.productId')
        .exec();
      if (!cart) {
        cart = await this.cartModel.create({ userId, items: [] });
      }
      const transformedUserCart = this.transformCartResponse(cart);
      return transformedUserCart;
    }
    if (sessionId) {
      let cart = await this.cartModel
        .findOne({ sessionId })
        .populate({
          path: 'items.productId',
          model: 'Product',
        })
        .exec();

      // cart for sessionId fetched

      if (!cart) cart = await this.cartModel.create({ sessionId, items: [] });

      // Log each cart item and its populated product
      const transformedCart = this.transformCartResponse(cart);
      return transformedCart;
    }
    throw new NotFoundException('userId or sessionId required');
  }

  private transformCartResponse(cart: any) {
    // Transforming cart response

    // Transform cart items to match frontend expectations
    const transformedItems = cart.items.map((item: any) => {
      // processing item

      const productData = item.productId;

      const transformedItem = {
        productId:
          productData?._id?.toString() ||
          productData?.toString() ||
          item.productId,
        quantity: item.qty,
        product:
          productData && typeof productData === 'object'
            ? {
                _id: productData._id,
                title: productData.title,
                basePrice: productData.basePrice,
                salePrice: productData.salePrice,
                images: productData.images,
                slug: productData.slug,
                availableSizes: productData.availableSizes,
                availableColors: productData.availableColors,
                description: productData.description,
                shortDescription: productData.shortDescription,
                isOnSale: productData.isOnSale,
                discountPercent: productData.discountPercent,
                ratingAverage: productData.ratingAverage,
                reviewCount: productData.reviewCount,
              }
            : null,
        price: (() => {
          // Try to get price from unitPrice first
          if (item.unitPrice) {
            const unitPriceStr = item.unitPrice.toString();
            const unitPriceNum = parseFloat(unitPriceStr);
            if (!isNaN(unitPriceNum) && unitPriceNum > 0) return unitPriceNum;
          }

          // Fallback to product base price
          if (productData?.basePrice) {
            const basePriceStr = productData.basePrice.toString();
            const basePriceNum = parseFloat(basePriceStr);
            if (!isNaN(basePriceNum) && basePriceNum > 0) return basePriceNum;
          }

          console.warn(
            'No valid price found for item:',
            item.title || item.sku || 'unknown',
          );
          return 0;
        })(),
      };
      // transformed item ready
      return transformedItem;
    });

    const result = {
      _id: cart._id,
      sessionId: cart.sessionId,
      userId: cart.userId,
      items: transformedItems,
      currency: cart.currency || 'USD',
      totalAmount: cart.total || 0,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };

    // final transformed cart ready
    return result;
  }

  async addToCart(
    item: any,
    userId?: string | Types.ObjectId,
    sessionId?: string,
  ) {
    // Adding to cart

    const cart = await this.getCartForUserRaw(userId, sessionId);
    // current cart items logged implicitly when needed

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (cartItem) => cartItem.productId?.toString() === item.productId,
    );

    // existing item index: ${existingItemIndex}

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      const oldQty = cart.items[existingItemIndex].qty;
      cart.items[existingItemIndex].qty += item.quantity || 1;
      // updated existing item quantity
    } else {
      // Add new item to cart - fetch product details for pricing
      // adding new item to cart

      try {
        const product = await this.productsService.findById(item.productId);
        // fetched product for pricing

        // Calculate the unit price (use sale price if on sale, otherwise base price)
        const unitPrice =
          product.isOnSale && product.salePrice
            ? product.salePrice
            : product.basePrice;

        cart.items.push({
          productId: new Types.ObjectId(item.productId),
          title: product.title,
          qty: item.quantity || 1,
          unitPrice: unitPrice,
          selectedOptions: item.selectedOptions || {},
          addedAt: new Date(),
        } as any);

        // item added with pricing
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        // Fall back to adding without pricing (will be 0 in calculations)
        cart.items.push({
          productId: new Types.ObjectId(item.productId),
          qty: item.quantity || 1,
          selectedOptions: item.selectedOptions || {},
          addedAt: new Date(),
        } as any);
      }
    }

    // Mark as modified and save
    cart.markModified('items');
    await cart.save();

    // Cart saved

    if (cart._id as any) {
      await this.recalc((cart._id as any).toString());
    }
    return this.getCartForUser(userId, sessionId);
  }

  private async getCartForUserRaw(
    userId?: string | Types.ObjectId,
    sessionId?: string,
  ) {
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

  async updateCartItem(
    itemId: string,
    quantity: number,
    userId?: string | Types.ObjectId,
    sessionId?: string,
  ) {
    console.log(
      `Updating cart item: itemId=${itemId}, quantity=${quantity}, sessionId=${sessionId}`,
    );

    const cart = await this.getCartForUserRaw(userId, sessionId);
    // cart items before update

    const itemIndex = cart.items.findIndex(
      (item) => item.productId?.toString() === itemId,
    );
    // item index found

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    if (quantity <= 0) {
      return this.removeFromCart(itemId, userId, sessionId);
    }

    // updating item quantity
    cart.items[itemIndex].qty = quantity;

    // Mark the items array as modified to ensure Mongoose saves it
    cart.markModified('items');
    await cart.save();

    // cart items after save

    await this.recalc((cart._id as any)?.toString());

    // Get fresh cart data
    const updatedCart = await this.getCartForUser(userId, sessionId);
    // final transformed cart items ready

    return updatedCart;
  }

  async removeFromCart(
    itemId: string,
    userId?: string | Types.ObjectId,
    sessionId?: string,
  ) {
    const cart = await this.getCartForUserRaw(userId, sessionId);
    const itemIndex = cart.items.findIndex(
      (item) => item.productId?.toString() === itemId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    await this.recalc((cart._id as any)?.toString());
    return this.getCartForUser(userId, sessionId);
  }

  async clearCart(userId?: string | Types.ObjectId, sessionId?: string) {
    const cart = await this.getCartForUserRaw(userId, sessionId);
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
    let cartModified = false;

    // First pass: populate missing pricing information
    for (const item of cart.items) {
      if (!item.unitPrice && item.productId) {
        try {
          console.log(
            `Fetching pricing for product ${item.productId} in recalc`,
          );
          const product = await this.productsService.findById(
            item.productId.toString(),
          );

          // Calculate the unit price (use sale price if on sale, otherwise base price)
          const unitPrice =
            product.isOnSale && product.salePrice
              ? product.salePrice
              : product.basePrice;

          item.unitPrice = unitPrice;
          item.title = product.title;
          cartModified = true;

          console.log(
            `Populated pricing for ${product.title}: ${unitPrice?.toString()}`,
          );
        } catch (error) {
          console.error(
            `Failed to fetch product ${item.productId} for pricing:`,
            error,
          );
          // Keep unitPrice undefined - will default to 0 in calculation
        }
      }
    }

    // Second pass: calculate totals
    for (const item of cart.items) {
      const unitPrice = item.unitPrice
        ? new Decimal((item.unitPrice as any).toString())
        : new Decimal(0);
      subtotal = subtotal.add(unitPrice.mul(item.qty));
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

    if (cartModified) {
      cart.markModified('items');
    }
    await cart.save();

    // Cart totals calculated
    return cart;
  }

  // Public method for debugging
  async getCartForUserRawPublic(
    userId?: string | Types.ObjectId,
    sessionId?: string,
  ) {
    return this.getCartForUserRaw(userId, sessionId);
  }
}