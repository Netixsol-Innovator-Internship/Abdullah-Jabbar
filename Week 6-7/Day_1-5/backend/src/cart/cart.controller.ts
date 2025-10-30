
// cart.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemQtyDto } from './dto/update-cart-item-qty.dto';

@Controller('cart')
export class CartController {
  constructor(private svc: CartService) {}

  @Get()
  async get(@Query('sessionId') sessionId: string, @Request() req: any) {
    const userId = req.user ? req.user._id : undefined;
    // Return transformed cart
    const cart = await this.svc.getCartForUser(userId, sessionId);
    return cart;
  }

  @Get('debug/:sessionId')
  async debugCart(@Param('sessionId') sessionId: string) {
    const rawCart = await this.svc.getCartForUserRawPublic(
      undefined,
      sessionId,
    );
    const populatedCart = await this.svc.cartModel
      .findOne({ sessionId })
      .populate('items.productId')
      .exec();

    return {
      rawCart,
      populatedCart,
      transformedCart: await this.svc.getCartForUser(undefined, sessionId),
    };
  }

  @Post('add')
  async addToCart(@Body() body: AddCartItemDto, @Request() req: any) {
    const userId = req.user ? req.user._id : undefined;
    return this.svc.addToCart(body, userId, body.sessionId);
  }

  @Put('update')
  async updateCartItem(
    @Body() body: { itemId: string; quantity: number; sessionId?: string },
    @Request() req: any,
  ) {
    const userId = req.user ? req.user._id : undefined;
    console.log('Controller: updateCartItem called with:', body);

    const result = await this.svc.updateCartItem(
      body.itemId,
      body.quantity,
      userId,
      body.sessionId,
    );

    console.log(
      'Controller: updateCartItem result:',
      JSON.stringify(result, null, 2),
    );
    return result;
  }

  @Delete('remove')
  async removeFromCart(
    @Body() body: { itemId: string; sessionId?: string },
    @Request() req: any,
  ) {
    const userId = req.user ? req.user._id : undefined;
    return this.svc.removeFromCart(body.itemId, userId, body.sessionId);
  }

  @Delete('clear')
  async clearCart(@Body() body: { sessionId?: string }, @Request() req: any) {
    const userId = req.user ? req.user._id : undefined;
    return this.svc.clearCart(userId, body.sessionId);
  }

  // Legacy endpoints - keeping for backward compatibility
  @Post(':cartId/items')
  async addItem(@Param('cartId') cartId: string, @Body() body: AddCartItemDto) {
    return this.svc.addItem(cartId, body);
  }

  @Post(':cartId/items/:index/qty')
  async updateQty(
    @Param('cartId') cartId: string,
    @Param('index') idx: string,
    @Body() body: UpdateCartItemQtyDto,
  ) {
    return this.svc.updateItemQty(cartId, parseInt(idx, 10), body.qty);
  }

  @Post(':cartId/recalc')
  async recalc(@Param('cartId') cartId: string) {
    return this.svc.recalc(cartId);
  }
}