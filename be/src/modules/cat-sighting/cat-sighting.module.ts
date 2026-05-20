import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryService } from '../../common/services/cloudinary.service';
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
import { AuthModule } from '../auth/auth.module';
import { CatSightingReadController } from './cat-sighting-read.controller';
import { CreateCatSightingController } from './create-cat-sighting/create-cat-sighting.controller';
import { CreateCatSightingUseCase } from './create-cat-sighting/create-cat-sighting.use-case';
import { GetCatSightingDetailUseCase } from './get-cat-sighting-detail/get-cat-sighting-detail.use-case';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: CatSighting.name, schema: CatSightingSchema },
      { name: LostCatReport.name, schema: LostCatReportSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: DeviceToken.name, schema: DeviceTokenSchema },
      { name: Cat.name, schema: CatSchema },
    ]),
  ],
  controllers: [CreateCatSightingController, CatSightingReadController],
  providers: [
    CreateCatSightingUseCase,
    GetCatSightingDetailUseCase,
    CloudinaryService,
    PushNotificationService,
  ],
})
export class CatSightingModule {}
