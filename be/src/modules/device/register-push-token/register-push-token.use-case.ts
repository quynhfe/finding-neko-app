import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  DeviceToken,
  DeviceTokenDocument,
} from '../../../models/device-token.schema';
import { RegisterPushTokenRequestDto } from './dto/register-push-token.request.dto';
import { RegisterPushTokenResponseDto } from './dto/register-push-token.response.dto';

interface RequestUser {
  id: string;
}

@Injectable()
export class RegisterPushTokenUseCase {
  constructor(
    @InjectModel(DeviceToken.name)
    private readonly deviceTokenModel: Model<DeviceTokenDocument>,
  ) {}

  async execute(
    dto: RegisterPushTokenRequestDto,
    user: RequestUser,
  ): Promise<RegisterPushTokenResponseDto> {
    const now = new Date();
    const deviceToken = await this.deviceTokenModel.findOneAndUpdate(
      { expoPushToken: dto.expoPushToken },
      {
        $set: {
          userId: new Types.ObjectId(user.id),
          expoPushToken: dto.expoPushToken,
          deviceId: dto.deviceId,
          platform: dto.platform,
          isActive: true,
          lastSeenAt: now,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return {
      success: true,
      deviceToken: {
        id: deviceToken._id.toString(),
        userId: deviceToken.userId.toString(),
        expoPushToken: deviceToken.expoPushToken,
        deviceId: deviceToken.deviceId,
        platform: deviceToken.platform,
        isActive: deviceToken.isActive,
        lastSeenAt: deviceToken.lastSeenAt,
        createdAt: deviceToken.createdAt,
        updatedAt: deviceToken.updatedAt,
      },
    };
  }
}
