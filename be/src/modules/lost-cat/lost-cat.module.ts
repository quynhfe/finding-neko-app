import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from '../../models/cat.schema';
import {
  LostCatReport,
  LostCatReportSchema,
} from '../../models/lost-cat-report.schema';
import { AuthModule } from '../auth/auth.module';
import { CreateLostCatReportController } from './create-lost-cat-report/create-lost-cat-report.controller';
import { CreateLostCatReportUseCase } from './create-lost-cat-report/create-lost-cat-report.use-case';
import { GetNearbyLostCatReportsController } from './get-nearby-lost-cat-reports/get-nearby-lost-cat-reports.controller';
import { GetNearbyLostCatReportsUseCase } from './get-nearby-lost-cat-reports/get-nearby-lost-cat-reports.use-case';
import { GetMyLostCatReportsUseCase } from './get-my-lost-cat-reports/get-my-lost-cat-reports.use-case';
import { LostCatManagementController } from './lost-cat-management.controller';
import { UpdateLostCatReportStatusUseCase } from './update-lost-cat-report-status/update-lost-cat-report-status.use-case';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Cat.name, schema: CatSchema },
      { name: LostCatReport.name, schema: LostCatReportSchema },
    ]),
  ],
  controllers: [
    CreateLostCatReportController,
    GetNearbyLostCatReportsController,
    LostCatManagementController,
  ],
  providers: [
    CreateLostCatReportUseCase,
    GetNearbyLostCatReportsUseCase,
    GetMyLostCatReportsUseCase,
    UpdateLostCatReportStatusUseCase,
  ],
})
export class LostCatModule {}
