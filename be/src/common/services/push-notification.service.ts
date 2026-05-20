import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  DeviceToken,
  DeviceTokenDocument,
} from '../../models/device-token.schema';

interface PushMessage {
  recipientId: Types.ObjectId;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

interface ExpoPushTicket {
  status: 'ok' | 'error';
  id?: string;
  message?: string;
  details?: {
    error?: string;
  };
}

@Injectable()
export class PushNotificationService {
  private readonly logger = new Logger(PushNotificationService.name);
  private readonly expoPushUrl = 'https://exp.host/--/api/v2/push/send';

  constructor(
    @InjectModel(DeviceToken.name)
    private readonly deviceTokenModel: Model<DeviceTokenDocument>,
  ) {}

  async sendToUser(message: PushMessage): Promise<number> {
    const deviceTokens = await this.deviceTokenModel.find({
      userId: message.recipientId,
      isActive: true,
    });

    if (!deviceTokens.length) {
      return 0;
    }

    const validDeviceTokens = deviceTokens.filter((deviceToken) =>
      this.isExpoPushToken(deviceToken.expoPushToken),
    );
    const invalidDeviceTokens = deviceTokens.filter(
      (deviceToken) => !this.isExpoPushToken(deviceToken.expoPushToken),
    );

    if (invalidDeviceTokens.length) {
      await this.deactivateTokens(
        invalidDeviceTokens.map((deviceToken) => deviceToken.expoPushToken),
      );
    }

    if (!validDeviceTokens.length) {
      return 0;
    }

    const payload = validDeviceTokens.map((deviceToken) => ({
      to: deviceToken.expoPushToken,
      sound: 'default',
      title: message.title,
      body: message.body,
      data: message.data ?? {},
      priority: 'high',
    }));

    try {
      const response = await fetch(this.expoPushUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        this.logger.error(`Expo push failed with status ${response.status}`);
        return 0;
      }

      const responseBody = (await response.json()) as {
        data?: ExpoPushTicket | ExpoPushTicket[];
      };
      const tickets = Array.isArray(responseBody.data)
        ? responseBody.data
        : responseBody.data
          ? [responseBody.data]
          : [];

      const tokensToDeactivate = tickets
        .map((ticket, index) => ({ ticket, token: validDeviceTokens[index]?.expoPushToken }))
        .filter(
          ({ ticket, token }) =>
            token &&
            ticket.status === 'error' &&
            ticket.details?.error === 'DeviceNotRegistered',
        )
        .map(({ token }) => token as string);

      if (tokensToDeactivate.length) {
        await this.deactivateTokens(tokensToDeactivate);
      }

      return tickets.filter((ticket) => ticket.status === 'ok').length;
    } catch (error) {
      this.logger.error(
        `Expo push request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return 0;
    }
  }

  private isExpoPushToken(token: string): boolean {
    return /^ExponentPushToken\[[\w-]+\]$/.test(token) || /^ExpoPushToken\[[\w-]+\]$/.test(token);
  }

  private async deactivateTokens(expoPushTokens: string[]): Promise<void> {
    await this.deviceTokenModel.updateMany(
      { expoPushToken: { $in: expoPushTokens } },
      { $set: { isActive: false } },
    );
  }
}
