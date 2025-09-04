import { Controller, Get } from '@nestjs/common';
import { PromotionsService } from './promotions.service';

@Controller('promotions')
export class PromotionsController {
  constructor(private svc: PromotionsService) {}

  @Get('active')
  async active() {
    return this.svc.listActive();
  }
}