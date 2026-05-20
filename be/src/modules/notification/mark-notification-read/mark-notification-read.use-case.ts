import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from '../../../models/notification.schema';
import { MarkNotificationReadResponseDto } from './dto/mark-notification-read.response.dto';

interface RequestUser {
  id: string;
}

@Injectable()
export class MarkNotificationReadUseCase {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async execute(
    notificationId: string,
    user: RequestUser,
  ): Promise<MarkNotificationReadResponseDto> {
    if (!Types.ObjectId.isValid(notificationId)) {
      throw new BadRequestException('ID thông báo không hợp lệ');
    }

    const readAt = new Date();
    const notification = await this.notificationModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(notificationId),
        recipientId: new Types.ObjectId(user.id),
      },
      { $set: { readAt } },
      { new: true },
    );

    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    return {
      success: true,
      notification: {
        id: notification._id.toString(),
        readAt: notification.readAt ?? readAt,
      },
    };
  }
}
