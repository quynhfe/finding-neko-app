import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetMyNotificationsUseCase } from './get-my-notifications/get-my-notifications.use-case';
import { GetMyNotificationsQueryDto } from './get-my-notifications/dto/get-my-notifications.query.dto';
import { GetMyNotificationsResponseDto } from './get-my-notifications/dto/get-my-notifications.response.dto';
import { MarkNotificationReadUseCase } from './mark-notification-read/mark-notification-read.use-case';
import { MarkNotificationReadResponseDto } from './mark-notification-read/dto/mark-notification-read.response.dto';

interface RequestUser {
  id: string;
}

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly getMyNotificationsUseCase: GetMyNotificationsUseCase,
    private readonly markNotificationReadUseCase: MarkNotificationReadUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyNotifications(
    @Query() query: GetMyNotificationsQueryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<GetMyNotificationsResponseDto> {
    return this.getMyNotificationsUseCase.execute(query, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async markNotificationRead(
    @Param('id') notificationId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<MarkNotificationReadResponseDto> {
    return this.markNotificationReadUseCase.execute(notificationId, user);
  }
}
