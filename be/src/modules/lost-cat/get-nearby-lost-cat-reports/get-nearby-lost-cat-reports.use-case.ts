import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat, CatDocument } from '../../../models/cat.schema';
import {
  LostCatReport,
  LostCatReportDocument,
} from '../../../models/lost-cat-report.schema';
import { GetNearbyLostCatReportsQueryDto } from './dto/get-nearby-lost-cat-reports.query.dto';
import { GetNearbyLostCatReportsResponseDto } from './dto/get-nearby-lost-cat-reports.response.dto';

@Injectable()
export class GetNearbyLostCatReportsUseCase {
  constructor(
    @InjectModel(LostCatReport.name)
    private readonly lostCatReportModel: Model<LostCatReportDocument>,
    @InjectModel(Cat.name) private readonly catModel: Model<CatDocument>,
  ) {}

  async execute(
    query: GetNearbyLostCatReportsQueryDto,
  ): Promise<GetNearbyLostCatReportsResponseDto> {
    const reports = await this.lostCatReportModel
      .find({
        status: 'active',
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [query.longitude, query.latitude],
            },
            $maxDistance: query.radiusKm * 1000,
          },
        },
      })
      .sort({ createdAt: -1 })
      .limit(50);

    const catIds = reports.map((report) => report.catId);
    const cats = await this.catModel.find({ _id: { $in: catIds } });
    const catsById = new Map(cats.map((cat) => [cat._id.toString(), cat]));

    return {
      success: true,
      reports: reports.map((report) => {
        const cat = catsById.get(report.catId.toString());

        return {
          id: report._id.toString(),
          catId: report.catId.toString(),
          ownerId: report.ownerId.toString(),
          catName: cat?.name ?? 'Unknown',
          catImages: cat?.images ?? [],
          locationText: report.locationText,
          latitude: report.location.coordinates[1],
          longitude: report.location.coordinates[0],
          description: report.description,
          status: report.status,
          createdAt: report.createdAt,
          updatedAt: report.updatedAt,
        };
      }),
    };
  }
}
