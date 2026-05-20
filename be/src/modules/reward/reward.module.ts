import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PushNotificationService } from '../../common/services/push-notification.service';
import {
  CatSighting,
  CatSightingSchema,
} from '../../models/cat-sighting.schema';
import { Cat, CatSchema } from '../../models/cat.schema';
import {
  DeviceToken,
  DeviceTokenSchema,
} from '../../models/device-token.schema';
import {
  LostCatReport,
  LostCatReportSchema,
} from '../../models/lost-cat-report.schema';
import {
  Notification,
  NotificationSchema,
} from '../../models/notification.schema';
import { StarReward, StarRewardSchema } from '../../models/star-reward.schema';
import { AuthModule } from '../auth/auth.module';
import { ConfirmSightingRewardUseCase } from './confirm-sighting-reward/confirm-sighting-reward.use-case';
import { GetLeaderboardUseCase } from './get-leaderboard/get-leaderboard.use-case';
import { RewardController } from './reward.controller';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: CatSighting.name, schema: CatSightingSchema },
      { name: LostCatReport.name, schema: LostCatReportSchema },
      { name: Cat.name, schema: CatSchema },
      { name: StarReward.name, schema: StarRewardSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: DeviceToken.name, schema: DeviceTokenSchema },
    ]),
  ],
  controllers: [RewardController],
  providers: [
    ConfirmSightingRewardUseCase,
    GetLeaderboardUseCase,
    PushNotificationService,
  ],
})
export class RewardModule {}
