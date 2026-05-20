import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cat, CatDocument } from '../../../models/cat.schema';
import {
  LostCatReport,
  LostCatReportDocument,
} from '../../../models/lost-cat-report.schema';
import { CreateLostCatReportRequestDto } from './dto/create-lost-cat-report.request.dto';
import { CreateLostCatReportResponseDto } from './dto/create-lost-cat-report.response.dto';

interface RequestUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

@Injectable()
export class CreateLostCatReportUseCase {
  constructor(
    @InjectModel(Cat.name) private readonly catModel: Model<CatDocument>,
    @InjectModel(LostCatReport.name)
    private readonly lostCatReportModel: Model<LostCatReportDocument>,
  ) {}

  async execute(
    dto: CreateLostCatReportRequestDto,
    user: RequestUser,
  ): Promise<CreateLostCatReportResponseDto> {
    const catObjectId = new Types.ObjectId(dto.catId);
    const ownerObjectId = new Types.ObjectId(user.id);
    const cat = await this.catModel.findOne({
      _id: catObjectId,
      ownerId: ownerObjectId,
    });

    if (!cat) {
      throw new NotFoundException('Không tìm thấy hồ sơ mèo');
    }

    const existingActiveReport = await this.lostCatReportModel.exists({
      catId: catObjectId,
      status: 'active',
    });

    if (existingActiveReport) {
      throw new BadRequestException('Mèo này đang có tin tìm kiếm đang hoạt động');
    }

    const report = await this.lostCatReportModel.create({
      catId: catObjectId,
      ownerId: ownerObjectId,
      locationText: dto.locationText.trim(),
      location: {
        type: 'Point',
        coordinates: [dto.longitude, dto.latitude],
      },
      description: dto.description.trim(),
      status: 'active',
    });

    if (!cat.isLost) {
      cat.isLost = true;
      await cat.save();
    }

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
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
      },
    };
  }
}
