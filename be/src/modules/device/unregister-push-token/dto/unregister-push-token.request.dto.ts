import { IsString, Matches } from 'class-validator';

export class UnregisterPushTokenRequestDto {
  @IsString()
  @Matches(/^(ExponentPushToken|ExpoPushToken)\[[\w-]+\]$/, {
    message: 'Expo push token không hợp lệ',
  })
  expoPushToken!: string;
}
