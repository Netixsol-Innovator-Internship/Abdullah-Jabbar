import { Controller, Post, Body, Param, Get, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private svc: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async checkout(@Body() body: { cartId: string; paymentMethod: string; shippingAddress: any }, @Request() req: any) {
    // Require userId matched to cart or admin
    return this.svc.placeOrderFromCart(body.cartId, body.paymentMethod, body.shippingAddress);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':orderNumber')
  async get(@Param('orderNumber') orderNumber: string) {
    return this.svc.findByOrderNumber(orderNumber);
  }
}