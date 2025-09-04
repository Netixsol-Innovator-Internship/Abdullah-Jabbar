import { Controller, Get, Param } from '@nestjs/common';
import { CouponsService } from './coupons.service';

@Controller('coupons')
export class CouponsController {
  constructor(private svc: CouponsService) {}

  @Get(':code')
  async get(@Param('code') code: string) {
    return this.svc.findByCode(code.toUpperCase());
  }
}