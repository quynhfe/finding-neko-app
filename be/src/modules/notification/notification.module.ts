import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from '../../models/notification.schema';
import { AuthModule } from '../auth/auth.module';
import { GetMyNotificationsUseCase } from './get-my-notifications/get-my-notifications.use-case';
import { MarkNotificationReadUseCase } from './mark-notification-read/mark-notification-read.use-case';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [GetMyNotificationsUseCase, MarkNotificationReadUseCase],
})
export class NotificationModule {}
