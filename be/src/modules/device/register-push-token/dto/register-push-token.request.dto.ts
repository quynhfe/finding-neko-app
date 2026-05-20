import { IsIn, IsOptional, IsString, MaxLength, Matches } from 'class-validator';

export class RegisterPushTokenRequestDto {
  @IsString()
  @Matches(/^(ExponentPushToken|ExpoPushToken)\[[\w-]+\]$/, {
    message: 'Expo push token không hợp lệ',
  })
  expoPushToken!: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  deviceId?: string;

  @IsOptional()
  @IsString()
  @IsIn(['ios', 'android', 'web'])
  platform?: string;
}
