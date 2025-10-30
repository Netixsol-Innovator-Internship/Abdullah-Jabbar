// app.module.ts

// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PromotionsModule } from './promotions/promotions.module';
import { CouponsModule } from './coupons/coupons.module';
import { ShippingModule } from './shipping/shipping.module';
import { SavedFiltersModule } from './saved-filters/saved-filters.module';
import { DatabaseModule } from './database/database.module';
import { UploadModule } from './upload/upload.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    AuthModule,
    UsersModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    PromotionsModule,
    CouponsModule,
    ShippingModule,
    SavedFiltersModule,
    DatabaseModule,
    UploadModule,
  ],
})
export class AppModule {}