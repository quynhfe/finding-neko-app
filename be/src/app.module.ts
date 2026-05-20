import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CatModule } from './modules/cat/cat.module';
import { FeedModule } from './modules/feed/feed.module';
import { LostCatModule } from './modules/lost-cat/lost-cat.module';
import { CatSightingModule } from './modules/cat-sighting/cat-sighting.module';
import { NotificationModule } from './modules/notification/notification.module';
import { DeviceModule } from './modules/device/device.module';
import { RewardModule } from './modules/reward/reward.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    AuthModule,
    UserModule,
    CatModule,
    FeedModule,
    LostCatModule,
    CatSightingModule,
    NotificationModule,
    DeviceModule,
    RewardModule,
  ],
})
export class AppModule {}
