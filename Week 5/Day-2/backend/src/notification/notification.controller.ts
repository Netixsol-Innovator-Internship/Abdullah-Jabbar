import { Controller, Get, Param, Post, UseGuards, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('notifications')
export class NotificationController {
  constructor(private notifications: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@CurrentUser() user: any, @Body() body: any) {
    return this.notifications.list(user.userId, 0, 50);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mark-read/:id')
  async markRead(@CurrentUser() user: any, @Param('id') id: string) {
    return this.notifications.markRead(user.userId, id);
  }
}
