export class RegisterPushTokenResponseDto {
  success!: boolean;
  deviceToken!: {
    id: string;
    userId: string;
    expoPushToken: string;
    deviceId?: string;
    platform?: string;
    isActive: boolean;
    lastSeenAt: Date;
    createdAt: Date;
    updatedAt: Date;
  };
}
