import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private svc: CartService) {}

  @Get()
  async get(@Query('sessionId') sessionId: string, @Request() req: any) {
    const userId = req.user ? req.user._id : undefined;
    return this.svc.getCartForUser(userId, sessionId);
  }

  @Post(':cartId/items')
  async addItem(@Param('cartId') cartId: string, @Body() body: any) {
    return this.svc.addItem(cartId, body);
  }

  @Post(':cartId/items/:index/qty')
  async updateQty(@Param('cartId') cartId: string, @Param('index') idx: string, @Body() body: { qty: number }) {
    return this.svc.updateItemQty(cartId, parseInt(idx, 10), body.qty);
  }

  @Post(':cartId/recalc')
  async recalc(@Param('cartId') cartId: string) {
    return this.svc.recalc(cartId);
  }
}