import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DeviceToken,
  DeviceTokenSchema,
} from '../../models/device-token.schema';
import { AuthModule } from '../auth/auth.module';
import { DeviceController } from './device.controller';
import { RegisterPushTokenUseCase } from './register-push-token/register-push-token.use-case';
import { UnregisterPushTokenUseCase } from './unregister-push-token/unregister-push-token.use-case';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: DeviceToken.name, schema: DeviceTokenSchema },
    ]),
  ],
  controllers: [DeviceController],
  providers: [RegisterPushTokenUseCase, UnregisterPushTokenUseCase],
})
export class DeviceModule {}
