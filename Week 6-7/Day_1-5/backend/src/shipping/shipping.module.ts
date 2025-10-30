
// shipping.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ShippingMethod,
  ShippingMethodSchema,
} from './schemas/shipping-method.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShippingMethod.name, schema: ShippingMethodSchema },
    ]),
  ],
  exports: [],
})
export class ShippingModule {}