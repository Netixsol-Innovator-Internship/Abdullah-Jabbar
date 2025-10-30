
// Simple orders controller for testing payment status updates
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CheckoutDto } from './dto/checkout.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private svc: OrdersService,
    private stripeService: StripeService,
  ) {}

  // Simple checkout endpoint
  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async checkout(@Body() body: CheckoutDto, @Request() req: any): Promise<any> {
    const userId = req.user ? req.user._id : undefined;
    const userEmail = req.user ? req.user.email : undefined;

    // Get cart data
    let cartData: any;
    if (body.cartId) {
      cartData = await this.svc.getCartForCheckout(body.cartId, userId);
    } else if (body.sessionId) {
      cartData = await this.svc.getCartForCheckoutBySession(
        body.sessionId,
        userId,
      );
    } else {
      throw new Error('Either cartId or sessionId is required');
    }

    if (!cartData?.items?.length) {
      throw new Error('Cart is empty');
    }

    // Create pending order first
    const pendingOrder = await this.svc.createPendingOrder(
      body.cartId,
      body.sessionId,
      userId?.toString(),
      body.paymentMethod,
      body.shippingAddress,
      cartData,
    );

    // Create Stripe session
    const lineItems = cartData.items.map((item: any) => {
      // Handle different price field names: price, unitPrice
      let price = 0;

      if (item.price !== undefined) {
        price = parseFloat(item.price);
      } else if (item.unitPrice !== undefined) {
        // Handle Decimal128 or string unitPrice
        const unitPriceValue =
          item.unitPrice.$numberDecimal || item.unitPrice.toString();
        price = parseFloat(unitPriceValue);
      }

      const qty = parseInt(item.qty) || 1;

      // processing item for stripe

      if (price <= 0 || isNaN(price)) {
        throw new BadRequestException(
          `Invalid price for item: ${item.title || 'Unknown item'}. Price: ${price}`,
        );
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: { name: item.title || 'Item' },
          unit_amount: Math.round(price * 100),
        },
        quantity: qty,
      };
    });

    const session = await this.stripeService.createCheckoutSession({
      lineItems,
      successUrl: `${process.env.FRONTEND_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.FRONTEND_URL}/cart`,
      customerEmail: userEmail, // Pre-fill and lock customer email
      metadata: {
        pendingOrderId: String(pendingOrder._id),
        orderNumber: pendingOrder.orderNumber,
      },
    });

    return {
      checkoutUrl: session.url,
      sessionId: session.id,
      pendingOrderId: pendingOrder._id,
    };
  }

  // Test endpoint to update payment status
  @Post('test-update-payment/:sessionId')
  async testUpdatePayment(@Param('sessionId') sessionId: string): Promise<any> {
    try {
      const result = await this.svc.updateOrderPaymentStatus(
        sessionId,
        'test_pi_123',
      );
      return {
        success: true,
        order: result,
        message: result ? 'Payment updated successfully' : 'No order found',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Update payment status endpoint
  @Post('update-payment-status')
  async updatePaymentStatus(
    @Body() body: { sessionId: string; paymentIntentId?: string },
  ): Promise<any> {
    try {
      const result = await this.svc.updateOrderPaymentStatus(
        body.sessionId,
        body.paymentIntentId,
      );
      return {
        success: true,
        order: result,
        message: result ? 'Payment updated successfully' : 'No order found',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get all orders with pagination and filtering
  @UseGuards(JwtAuthGuard)
  @Get()
  async getOrders(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('userId') userId?: string,
    @Query('paymentStatus') paymentStatus?: string,
    @Query('shippingStatus') shippingStatus?: string,
  ): Promise<any> {
    const userRoles = req.user.roles || [];
    const requestingUserId = req.user._id;

    // If userId is provided, ensure user can only access their own orders (or admin can access any)
    // Normalize to strings to avoid ObjectId vs string strict inequality issues
    if (
      userId &&
      String(requestingUserId) !== String(userId) &&
      !userRoles.includes('admin')
    ) {
      throw new BadRequestException('You can only access your own orders');
    }

    return this.svc.list({
      page: page || '1',
      limit: limit || '10',
      userId,
      paymentStatus,
      shippingStatus,
    });
  }

  // Get latest order for user
  @UseGuards(JwtAuthGuard)
  @Get('latest')
  async getLatestOrder(@Request() req: any): Promise<any> {
    const userId = req.user._id;
    return this.svc.getLatestUserOrder(userId);
  }

  // Get orders for a specific user with pagination
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getUserOrders(
    @Param('userId') userId: string,
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('paymentStatus') paymentStatus?: string,
    @Query('shippingStatus') shippingStatus?: string,
    @Query('sortBy') sortBy?: 'createdAt' | 'updatedAt' | 'total',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ): Promise<any> {
    // Ensure user can only access their own orders (or admin can access any)
    const requestingUserId = req.user._id;
    const userRoles = req.user.roles || [];

    if (
      String(requestingUserId) !== String(userId) &&
      !userRoles.includes('admin')
    ) {
      throw new BadRequestException('You can only access your own orders');
    }

    // Use the new findOrdersByUserId method for better performance and features
    return this.svc.findOrdersByUserId(userId, {
      page: parseInt(page || '1'),
      limit: parseInt(limit || '10'),
      paymentStatus,
      shippingStatus,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
    });
  }

  // Get order summary for a specific user
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId/summary')
  async getUserOrdersSummary(
    @Param('userId') userId: string,
    @Request() req: any,
  ): Promise<any> {
    // Ensure user can only access their own summary (or admin can access any)
    const requestingUserId = req.user._id;
    const userRoles = req.user.roles || [];

    if (
      String(requestingUserId) !== String(userId) &&
      !userRoles.includes('admin')
    ) {
      throw new BadRequestException(
        'You can only access your own order summary',
      );
    }

    return this.svc.getUserOrdersSummary(userId);
  }
}
