import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  LostCatReport,
  LostCatReportDocument,
} from '../../../models/lost-cat-report.schema';
import { GetMyLostCatReportsResponseDto } from './dto/get-my-lost-cat-reports.response.dto';

interface RequestUser {
  id: string;
}

@Injectable()
export class GetMyLostCatReportsUseCase {
  constructor(
    @InjectModel(LostCatReport.name)
    private readonly lostCatReportModel: Model<LostCatReportDocument>,
  ) {}

  async execute(user: RequestUser): Promise<GetMyLostCatReportsResponseDto> {
    const reports = await this.lostCatReportModel
      .find({ ownerId: new Types.ObjectId(user.id) })
      .sort({ createdAt: -1 });

    return {
      success: true,
      reports: reports.map((report) => ({
        id: report._id.toString(),
        catId: report.catId.toString(),
        ownerId: report.ownerId.toString(),
        locationText: report.locationText,
        latitude: report.location.coordinates[1],
        longitude: report.location.coordinates[0],
        description: report.description,
        status: report.status,
        resolvedAt: report.resolvedAt,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
      })),
    };
  }
}
