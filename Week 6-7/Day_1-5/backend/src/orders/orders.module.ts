
// orders.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { StripeService } from './stripe.service';
import { StripeWebhookController } from './stripe-webhook.controller';
import { CartModule } from '../cart/cart.module';
import { UsersModule } from '../users/users.module';
import { Cart, CartSchema } from '../cart/schemas/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Cart.name, schema: CartSchema },
    ]),
    CartModule,
    UsersModule,
  ],
  providers: [OrdersService, StripeService],
  controllers: [OrdersController, StripeWebhookController],
})
export class OrdersModule {}