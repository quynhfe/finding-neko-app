import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  DeviceToken,
  DeviceTokenDocument,
} from '../../../models/device-token.schema';
import { UnregisterPushTokenRequestDto } from './dto/unregister-push-token.request.dto';
import { UnregisterPushTokenResponseDto } from './dto/unregister-push-token.response.dto';

interface RequestUser {
  id: string;
}

@Injectable()
export class UnregisterPushTokenUseCase {
  constructor(
    @InjectModel(DeviceToken.name)
    private readonly deviceTokenModel: Model<DeviceTokenDocument>,
  ) {}

  async execute(
    dto: UnregisterPushTokenRequestDto,
    user: RequestUser,
  ): Promise<UnregisterPushTokenResponseDto> {
    await this.deviceTokenModel.updateOne(
      {
        userId: new Types.ObjectId(user.id),
        expoPushToken: dto.expoPushToken,
      },
      { $set: { isActive: false } },
    );

    return {
      success: true,
      message: 'Đã hủy đăng ký push token',
    };
  }
}
