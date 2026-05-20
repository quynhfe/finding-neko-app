import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CatSighting,
  CatSightingDocument,
} from '../../../models/cat-sighting.schema';
import { GetCatSightingDetailResponseDto } from './dto/get-cat-sighting-detail.response.dto';

interface RequestUser {
  id: string;
}

@Injectable()
export class GetCatSightingDetailUseCase {
  constructor(
    @InjectModel(CatSighting.name)
    private readonly catSightingModel: Model<CatSightingDocument>,
  ) {}

  async execute(
    sightingId: string,
    user: RequestUser,
  ): Promise<GetCatSightingDetailResponseDto> {
    if (!Types.ObjectId.isValid(sightingId)) {
      throw new BadRequestException('ID báo thấy mèo không hợp lệ');
    }

    const userId = new Types.ObjectId(user.id);
    const sighting = await this.catSightingModel.findOne({
      _id: new Types.ObjectId(sightingId),
      $or: [{ reporterId: userId }, { 'candidates.ownerId': userId }],
    });

    if (!sighting) {
      throw new NotFoundException('Không tìm thấy báo cáo thấy mèo');
    }

    return {
      success: true,
      sighting: {
        id: sighting._id.toString(),
        reporterId: sighting.reporterId.toString(),
        image: sighting.image,
        locationText: sighting.locationText,
        latitude: sighting.location.coordinates[1],
        longitude: sighting.location.coordinates[0],
        description: sighting.description,
        candidates: sighting.candidates.map((candidate) => ({
          lostCatReportId: candidate.lostCatReportId.toString(),
          catId: candidate.catId.toString(),
          ownerId: candidate.ownerId.toString(),
          distanceMeters: candidate.distanceMeters,
          status: candidate.status,
        })),
        createdAt: sighting.createdAt,
        updatedAt: sighting.updatedAt,
      },
    };
  }
}
