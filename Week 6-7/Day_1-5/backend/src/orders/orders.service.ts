
// orders.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model, ClientSession, Types } from 'mongoose';
import { CartService } from '../cart/cart.service';
import { UsersService } from '../users/users.service';
import { StripeService } from './stripe.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private cartService: CartService,
    private usersService: UsersService,
    private stripeService: StripeService,
  ) {}

  // ===== CART DATA RETRIEVAL =====

  // Get cart data for checkout by session without creating order
  async getCartForCheckoutBySession(
    sessionId: string,
    userId?: string,
  ): Promise<any> {
    const cart = await this.cartService.getCartForUserRawPublic(
      userId,
      sessionId,
    );
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart empty');
    }

    // Transform cart items to have consistent price field for checkout
    const transformedItems = cart.items.map((item: any) => {
      let price = 0;

      // Handle Decimal128 unitPrice
      if (item.unitPrice) {
        const unitPriceValue =
          item.unitPrice.$numberDecimal || item.unitPrice.toString();
        price = parseFloat(unitPriceValue);
      }

      return {
        ...item,
        price: price,
        qty: item.qty || 1,
      };
    });

    // Important: cart transformed for checkout (no verbose dump)

    return {
      _id: cart._id,
      sessionId: cart.sessionId,
      userId: cart.userId,
      items: transformedItems,
      subtotal: cart.subtotal || 0,
      discounts: cart.discounts || 0,
      total: cart.total || 0,
      currency: cart.currency || 'USD',
    };
  }

  // Get cart data for debugging purposes
  async getCartForDebug(userId?: string, sessionId?: string): Promise<any> {
    const cart = await this.cartService.getCartForUserRawPublic(
      userId,
      sessionId,
    );
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Debug endpoint - skipping verbose cart dump

    // Transform cart items to have consistent price field
    const transformedItems = cart.items.map((item: any) => {
      let price = 0;

      // Handle Decimal128 unitPrice
      if (item.unitPrice) {
        const unitPriceValue =
          item.unitPrice.$numberDecimal || item.unitPrice.toString();
        price = parseFloat(unitPriceValue);
      }

      return {
        ...item,
        price: price,
        qty: item.qty || 1,
      };
    });

    return {
      _id: cart._id,
      items: transformedItems,
      subtotal: cart.subtotal || 0,
      discounts: cart.discounts || 0,
      total: cart.total || 0,
      currency: cart.currency || 'USD',
    };
  }

  // Get cart data for checkout by cart ID
  async getCartForCheckout(cartId: string, userId?: string): Promise<any> {
    const cart = await this.cartService.cartModel.findById(cartId).exec();
    if (!cart) {
      throw new BadRequestException('Cart not found');
    }
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Transform cart items to have consistent price field for checkout
    const transformedItems = cart.items.map((item: any) => {
      let price = 0;

      // Handle Decimal128 unitPrice
      if (item.unitPrice) {
        const unitPriceValue =
          item.unitPrice.$numberDecimal || item.unitPrice.toString();
        price = parseFloat(unitPriceValue);
      }

      return {
        ...item,
        price: price,
        qty: item.qty || 1,
      };
    });

    // Cart fetched for checkout by ID

    return {
      _id: cart._id,
      sessionId: cart.sessionId,
      userId: cart.userId,
      items: transformedItems,
      subtotal: cart.subtotal || 0,
      discounts: cart.discounts || 0,
      total: cart.total || 0,
      currency: cart.currency || 'USD',
    };
  }

  // ===== ORDER CREATION =====

  // Create a pending order that will be completed when payment succeeds
  async createPendingOrder(
    cartId: string | undefined,
    sessionId: string | undefined,
    userId: string | undefined,
    paymentMethod: string,
    shippingAddress: any,
    cartData: any,
  ): Promise<OrderDocument> {
    try {
      // Creating pending order

      const orderNumber = this.generateOrderNumber();
      const customer = userId
        ? await this.buildCustomerSnapshot(userId)
        : undefined;

      const order = await this.orderModel.create({
        orderNumber,
        sessionId: sessionId,
        customer,
        items: cartData.items,
        subtotal: cartData.subtotal || 0,
        discounts: cartData.discounts || 0,
        couponCode: cartData.couponCode,
        couponDiscountAmount: cartData.couponDiscountAmount || 0,
        deliveryFee: cartData.deliveryFee || 0,
        tax: cartData.tax || 0,
        total: cartData.total || 0,
        currency: cartData.currency || 'USD',
        shippingAddress,
        placedAt: new Date(),
        paymentStatus: 'pending',
        shippingStatus: 'pending',
      });

      console.log('Pending order created:', order.orderNumber);
      return order;
    } catch (error) {
      console.error('Error creating pending order:', error);
      throw error;
    }
  }

  // ===== LEGACY ORDER CREATION (DEPRECATED) =====
  // These methods are kept for compatibility but should be replaced with the pending order flow

  // Generic placeOrder method that handles both cartId and sessionId
  async placeOrder(
    cartId: string | undefined,
    sessionId: string | undefined,
    paymentMethod: string,
    shippingAddress: any,
    userId?: string,
  ): Promise<OrderDocument> {
    if (cartId) {
      return this.placeOrderFromCart(
        cartId,
        paymentMethod,
        shippingAddress,
        userId,
      );
    } else if (sessionId) {
      return this.placeOrderFromSession(
        sessionId,
        paymentMethod,
        shippingAddress,
        userId,
      );
    } else {
      throw new BadRequestException('Either cartId or sessionId is required');
    }
  }

  async placeOrderFromCart(
    cartId: string,
    paymentMethod: string,
    shippingAddress: any,
    userId?: string,
  ): Promise<OrderDocument> {
    const cart = await this.cartService.recalc(cartId);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart empty');
    }

    const session: ClientSession = await (
      this.orderModel.db as any
    ).startSession();
    session.startTransaction();

    try {
      const orderNumber = this.generateOrderNumber();
      const customer = cart.userId
        ? await this.buildCustomerSnapshot(cart.userId as any)
        : undefined;

      const order = await this.orderModel.create(
        [
          {
            orderNumber,
            userId: userId || cart.userId,
            customer,
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

      await (this.cartService as any).cartModel
        .findByIdAndDelete(cart._id)
        .session(session);
      await session.commitTransaction();
      session.endSession();

      return order[0];
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  async placeOrderFromSession(
    sessionId: string,
    paymentMethod: string,
    shippingAddress: any,
    userId?: string,
  ): Promise<OrderDocument> {
    // Note: This uses raw cart data - consider updating to use getCartForUser for price transformation
    const cart = await this.cartService.getCartForUserRawPublic(
      userId,
      sessionId,
    );
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart empty');
    }

    await this.cartService.recalc((cart._id as any)?.toString());
    const updatedCart = await this.cartService.getCartForUserRawPublic(
      userId,
      sessionId,
    );

    const session: ClientSession = await (
      this.orderModel.db as any
    ).startSession();
    session.startTransaction();

    try {
      const orderNumber = this.generateOrderNumber();
      const customer = userId
        ? await this.buildCustomerSnapshot(userId)
        : undefined;

      const order = await this.orderModel.create(
        [
          {
            orderNumber,
            userId: userId || null,
            sessionId: sessionId,
            customer,
            items: updatedCart.items,
            subtotal: updatedCart.subtotal || 0,
            discounts: updatedCart.discounts || 0,
            couponCode: updatedCart.couponCode,
            couponDiscountAmount: updatedCart.couponDiscountAmount || 0,
            deliveryFee: updatedCart.deliveryFee || 0,
            tax: updatedCart.tax || 0,
            total: updatedCart.total || 0,
            currency: updatedCart.currency || 'USD',
            paymentMethod,
            shippingAddress,
            placedAt: new Date(),
            paymentStatus: 'pending',
            fulfillmentStatus: 'pending',
          },
        ],
        { session },
      );

      await this.cartService.clearCart(userId, sessionId);
      await session.commitTransaction();
      session.endSession();

      return order[0];
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  // ===== PAYMENT HANDLING =====

  // Called by webhook when a checkout.session is completed
  async handlePaymentSuccessWithDetails(
    sessionId: string,
    paymentStatus?: string,
    paymentIntentId?: string,
  ) {
    try {
      // handlePaymentSuccessWithDetails invoked

      // Check if order already exists for this session to avoid duplicates
      const existingOrder = await this.orderModel
        .findOne({ paymentSessionId: sessionId })
        .exec();

      if (existingOrder) {
        // Order already exists for session - return it
        return existingOrder;
      }

      // First, try to find a pending order with this payment session ID
      let pendingOrder = await this.orderModel
        .findOne({ paymentSessionId: sessionId, paymentStatus: 'pending' })
        .exec();

      if (pendingOrder) {
        return this.completePendingOrder(
          pendingOrder,
          sessionId,
          paymentIntentId,
        );
      }

      // If no pending order found, check Stripe session metadata for fallback
      const stripe = this.stripeService.getStripeInstance();
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (!session?.metadata) {
        console.error(
          'Session metadata not found and no pending order found:',
          sessionId,
        );
        throw new Error(
          'Session metadata not found and no pending order found',
        );
      }

      const { pendingOrderId } = session.metadata;
      // metadata extracted from stripe session

      // Find the pending order by metadata ID and update it
      if (pendingOrderId) {
        pendingOrder = await this.orderModel.findById(pendingOrderId).exec();
        if (pendingOrder) {
          return this.completePendingOrder(
            pendingOrder,
            sessionId,
            paymentIntentId,
          );
        }
      }

      console.error('No pending order found for session');
      throw new Error('No pending order found for this payment session');
    } catch (error) {
      console.error('Error in handlePaymentSuccessWithDetails:', error);
      throw error;
    }
  }

  // Legacy method for backward compatibility
  async handlePaymentSuccess(
    sessionId: string,
    paymentStatus?: string,
    paymentIntentId?: string,
  ) {
    return this.handlePaymentSuccessWithDetails(
      sessionId,
      paymentStatus,
      paymentIntentId,
    );
  }

  // Simple method to update a pending order to completed when payment succeeds
  async updateOrderPaymentStatus(
    sessionId: string,
    paymentIntentId?: string,
  ): Promise<OrderDocument | null> {
    try {
      // Update payment status - look up by sessionId or fallback to most recent pending
      let order = await this.orderModel
        .findOne({ paymentSessionId: sessionId })
        .exec();
      if (order)
        return this.completePendingOrder(order, sessionId, paymentIntentId);

      order = await this.orderModel
        .findOne({ paymentStatus: 'pending' })
        .sort({ createdAt: -1 })
        .exec();
      if (order)
        return this.completePendingOrder(order, sessionId, paymentIntentId);

      return null;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  // Manual order completion (fallback for webhook failures)
  async completeOrderPayment(
    orderNumber: string,
    userId?: string,
    sessionId?: string,
    paymentIntentId?: string,
  ): Promise<OrderDocument | null> {
    // Completing order payment

    const query: any = { orderNumber };
    if (userId) query.userId = userId;

    const order = await this.orderModel.findOne(query).exec();
    if (!order) throw new Error('Order not found');
    if (order.paymentStatus === 'completed') return order;

    return this.completePendingOrder(order, sessionId, paymentIntentId);
  }

  // ===== PAYMENT INTENT HANDLERS =====

  async handlePaymentIntentSucceeded(paymentIntentId: string, status?: string) {
    const order = await this.orderModel
      .findOne({ paymentProviderId: paymentIntentId })
      .exec();
    if (!order) return null;
    order.paymentStatus = 'paid';
    await order.save();
    return order;
  }

  async handlePaymentIntentFailed(paymentIntentId: string, status?: string) {
    const order = await this.orderModel
      .findOne({ paymentProviderId: paymentIntentId })
      .exec();
    if (!order) return null;
    order.paymentStatus = 'failed';
    await order.save();
    return order;
  }

  // ===== ORDER RETRIEVAL =====

  async findByOrderNumber(orderNumber: string): Promise<OrderDocument | null> {
    return this.orderModel
      .findOne({ orderNumber })
      .populate('items.product')
      .exec();
  }

  async findOne(id: string, userId: string): Promise<OrderDocument | null> {
    const userFilter = Types.ObjectId.isValid(userId)
      ? { 'customer.userId': new Types.ObjectId(userId) }
      : { 'customer.userId': userId };

    return this.orderModel
      .findOne({ _id: id, ...userFilter })
      .populate('items.product')
      .exec();
  }

  async findBySessionId(sessionId: string): Promise<OrderDocument | null> {
    return this.orderModel.findOne({ paymentSessionId: sessionId }).exec();
  }

  async getLatestUserOrder(userId: string): Promise<OrderDocument | null> {
    const filter = Types.ObjectId.isValid(userId)
      ? { 'customer.userId': new Types.ObjectId(userId) }
      : { 'customer.userId': userId };
    return this.orderModel.findOne(filter).sort({ createdAt: -1 }).exec();
  }

  async findPendingOrders(limit: number = 10): Promise<OrderDocument[]> {
    return this.orderModel
      .find({ paymentStatus: 'pending' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  // ===== ORDER LISTING =====

  async list(query: {
    page?: number | string;
    limit?: number | string;
    userId?: string;
    paymentStatus?: string;
    shippingStatus?: string;
  }): Promise<any> {
    const page = Math.max(parseInt(query.page as any) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(query.limit as any) || 10, 1),
      100,
    );

    const filter: Record<string, any> = {};

    if (query.userId) {
      filter.$or = [
        ...(Types.ObjectId.isValid(query.userId)
          ? [{ 'customer.userId': new Types.ObjectId(query.userId) }]
          : []),
        { 'customer.userId': query.userId.toString() },
      ];
    }
    if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
    if (query.shippingStatus) filter.shippingStatus = query.shippingStatus;

    const [orders, totalOrders] = await Promise.all([
      this.orderModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(totalOrders / limit) || 1;
    return { orders, totalOrders, totalPages, page, limit };
  }

  // ===== USER-SPECIFIC METHODS =====

  /**
   * Find orders by user ID with pagination
   * @param userId - The user's _id to match with order's customer.userId attribute
   * @param options - Pagination and sorting options
   * @returns Paginated list of user's orders
   */
  async findOrdersByUserId(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      paymentStatus?: string;
      shippingStatus?: string;
      sortBy?: 'createdAt' | 'updatedAt' | 'total';
      sortOrder?: 'asc' | 'desc';
    } = {},
  ): Promise<{
    orders: OrderDocument[];
    totalOrders: number;
    totalPages: number;
    page: number;
    limit: number;
  }> {
    const page = Math.max(options.page || 1, 1);
    const limit = Math.min(Math.max(options.limit || 10, 1), 100);
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder === 'asc' ? 1 : -1;

    // Build filter for user's orders - check both customer.userId and direct userId fields
    const filter: Record<string, any> = {};

    // Create an $or query to check both possible fields where user ID might be stored
    const userIdConditions: Array<Record<string, any>> = [];

    // Check customer.userId field (new format)
    if (Types.ObjectId.isValid(userId)) {
      userIdConditions.push({ 'customer.userId': new Types.ObjectId(userId) });
    }
    userIdConditions.push({ 'customer.userId': userId });

    // Check direct userId field (legacy format)
    if (Types.ObjectId.isValid(userId)) {
      userIdConditions.push({ userId: new Types.ObjectId(userId) });
    }
    userIdConditions.push({ userId: userId });

    filter.$or = userIdConditions;

    // Add optional filters
    if (options.paymentStatus) {
      filter.paymentStatus = options.paymentStatus;
    }
    if (options.shippingStatus) {
      filter.shippingStatus = options.shippingStatus;
    }

    // Finding orders with filter

    // Execute queries in parallel
    const [orders, totalOrders] = await Promise.all([
      this.orderModel
        .find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments(filter).exec(),
    ]);

    // Found X orders for user

    const totalPages = Math.ceil(totalOrders / limit) || 1;

    return {
      orders,
      totalOrders,
      totalPages,
      page,
      limit,
    };
  }

  /**
   * Get user's orders summary with counts by status
   * @param userId - The user's _id to match with order's customer.userId attribute
   * @returns Summary with order counts by payment and shipping status
   */
  async getUserOrdersSummary(userId: string): Promise<{
    totalOrders: number;
    byPaymentStatus: Record<string, number>;
    byShippingStatus: Record<string, number>;
    totalSpent: number;
  }> {
    const userFilter = Types.ObjectId.isValid(userId)
      ? { 'customer.userId': new Types.ObjectId(userId) }
      : { 'customer.userId': userId };

    const [
      totalOrders,
      paymentStatusCounts,
      shippingStatusCounts,
      totalSpentResult,
    ] = await Promise.all([
      this.orderModel.countDocuments(userFilter).exec(),
      this.orderModel.aggregate([
        { $match: userFilter },
        { $group: { _id: '$paymentStatus', count: { $sum: 1 } } },
      ]),
      this.orderModel.aggregate([
        { $match: userFilter },
        { $group: { _id: '$shippingStatus', count: { $sum: 1 } } },
      ]),
      this.orderModel.aggregate([
        { $match: { ...userFilter, paymentStatus: 'completed' } },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $toDouble: {
                  $ifNull: ['$total', 0],
                },
              },
            },
          },
        },
      ]),
    ]);

    const byPaymentStatus = paymentStatusCounts.reduce(
      (acc, item) => {
        acc[item._id] = item.count;
        return acc;
      },
      {} as Record<string, number>,
    );

    const byShippingStatus = shippingStatusCounts.reduce(
      (acc, item) => {
        acc[item._id] = item.count;
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalSpent = totalSpentResult[0]?.total || 0;

    return {
      totalOrders,
      byPaymentStatus,
      byShippingStatus,
      totalSpent,
    };
  }

  // ===== HELPER METHODS =====

  async countOrders(filter: Record<string, any>): Promise<number> {
    return this.orderModel.countDocuments(filter as any).exec();
  }

  async getSampleOrders(limit: number = 5): Promise<OrderDocument[]> {
    return this.orderModel.find({}).limit(limit).exec();
  }

  private generateOrderNumber(): string {
    return `ORD-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`;
  }

  private async buildCustomerSnapshot(userId: string): Promise<any> {
    const user = await this.usersService.findById(userId as any);
    if (!user) return undefined;

    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    };
  }

  private async completePendingOrder(
    order: OrderDocument,
    sessionId?: string,
    paymentIntentId?: string,
  ): Promise<OrderDocument> {
    order.paymentStatus = 'completed';
    order.paymentProvider = 'stripe';

    if (sessionId) order.paymentSessionId = sessionId;
    if (paymentIntentId) {
      order.stripePaymentIntentId = paymentIntentId;
      order.paymentProviderId = paymentIntentId;
    }

    await order.save();
    console.log('Order payment completed:', order.orderNumber);
    return order;
  }
}