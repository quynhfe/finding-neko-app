import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cat, CatDocument } from '../../../models/cat.schema';
import {
  LostCatReport,
  LostCatReportDocument,
  LostCatReportStatus,
} from '../../../models/lost-cat-report.schema';
import { UpdateLostCatReportStatusResponseDto } from './dto/update-lost-cat-report-status.response.dto';

interface RequestUser {
  id: string;
}

@Injectable()
export class UpdateLostCatReportStatusUseCase {
  constructor(
    @InjectModel(LostCatReport.name)
    private readonly lostCatReportModel: Model<LostCatReportDocument>,
    @InjectModel(Cat.name) private readonly catModel: Model<CatDocument>,
  ) {}

  async execute(
    reportId: string,
    status: Extract<LostCatReportStatus, 'resolved' | 'cancelled'>,
    user: RequestUser,
  ): Promise<UpdateLostCatReportStatusResponseDto> {
    if (!Types.ObjectId.isValid(reportId)) {
      throw new BadRequestException('ID tin mèo lạc không hợp lệ');
    }

    const report = await this.lostCatReportModel.findOne({
      _id: new Types.ObjectId(reportId),
      ownerId: new Types.ObjectId(user.id),
    });

    if (!report) {
      throw new NotFoundException('Không tìm thấy tin mèo lạc');
    }

    if (report.status !== 'active') {
      throw new BadRequestException('Tin mèo lạc này đã được xử lý');
    }

    report.status = status;
    report.resolvedAt = new Date();
    await report.save();

    await this.catModel.updateOne(
      { _id: report.catId, ownerId: new Types.ObjectId(user.id) },
      { $set: { isLost: false } },
    );

    return {
      success: true,
      report: {
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
      },
    };
  }
}
