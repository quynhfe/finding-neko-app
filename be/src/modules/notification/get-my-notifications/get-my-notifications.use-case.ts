import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from '../../../models/notification.schema';
import { GetMyNotificationsQueryDto } from './dto/get-my-notifications.query.dto';
import { GetMyNotificationsResponseDto } from './dto/get-my-notifications.response.dto';

interface RequestUser {
  id: string;
}

@Injectable()
export class GetMyNotificationsUseCase {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async execute(
    query: GetMyNotificationsQueryDto,
    user: RequestUser,
  ): Promise<GetMyNotificationsResponseDto> {
    const filter: Record<string, unknown> = {
      recipientId: new Types.ObjectId(user.id),
    };

    if (query.unreadOnly) {
      filter.readAt = { $exists: false };
    }

    const notifications = await this.notificationModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    return {
      success: true,
      notifications: notifications.map((notification) => ({
        id: notification._id.toString(),
        recipientId: notification.recipientId.toString(),
        actorId: notification.actorId.toString(),
        type: notification.type,
        title: notification.title,
        body: notification.body,
        data: notification.data,
        readAt: notification.readAt,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      })),
    };
  }
}
