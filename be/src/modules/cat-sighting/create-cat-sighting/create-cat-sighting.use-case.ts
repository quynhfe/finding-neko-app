import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from '../../../common/services/cloudinary.service';
import { PushNotificationService } from '../../../common/services/push-notification.service';
import {
  CatSighting,
  CatSightingDocument,
} from '../../../models/cat-sighting.schema';
import { Cat, CatDocument } from '../../../models/cat.schema';
import {
  LostCatReport,
  LostCatReportDocument,
} from '../../../models/lost-cat-report.schema';
import {
  Notification,
  NotificationDocument,
} from '../../../models/notification.schema';
import { CreateCatSightingRequestDto } from './dto/create-cat-sighting.request.dto';
import { CreateCatSightingResponseDto } from './dto/create-cat-sighting.response.dto';

interface RequestUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

interface NearbyLostReport {
  _id: Types.ObjectId;
  catId: Types.ObjectId;
  ownerId: Types.ObjectId;
  distanceMeters: number;
}

@Injectable()
export class CreateCatSightingUseCase {
  constructor(
    @InjectModel(CatSighting.name)
    private readonly catSightingModel: Model<CatSightingDocument>,
    @InjectModel(LostCatReport.name)
    private readonly lostCatReportModel: Model<LostCatReportDocument>,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    @InjectModel(Cat.name) private readonly catModel: Model<CatDocument>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  async execute(
    dto: CreateCatSightingRequestDto,
    imageFile: Express.Multer.File | undefined,
    user: RequestUser,
  ): Promise<CreateCatSightingResponseDto> {
    if (!imageFile) {
      throw new BadRequestException('Cần tải lên 1 ảnh mèo đã thấy');
    }

    let uploadedImage: { url: string; publicId: string };
    try {
      uploadedImage = await this.cloudinaryService.uploadSightingImage(imageFile);
    } catch (error) {
      throw new InternalServerErrorException(
        'Không thể tải ảnh mèo đã thấy lên Cloudinary',
      );
    }

    const nearbyReports = await this.findNearbyLostReports(dto, user.id);
    const candidates = nearbyReports.map((report) => ({
      lostCatReportId: report._id,
      catId: report.catId,
      ownerId: report.ownerId,
      distanceMeters: Math.round(report.distanceMeters),
      status: 'pending_owner_review' as const,
    }));

    try {
      const sighting = await this.catSightingModel.create({
        reporterId: new Types.ObjectId(user.id),
        image: uploadedImage,
        locationText: dto.locationText.trim(),
        location: {
          type: 'Point',
          coordinates: [dto.longitude, dto.latitude],
        },
        description: dto.description?.trim() ?? '',
        candidates,
      });

      const notificationCount = await this.createOwnerNotifications(
        sighting._id,
        user,
        candidates,
      );

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
          notificationCount,
          createdAt: sighting.createdAt,
          updatedAt: sighting.updatedAt,
        },
      };
    } catch (error) {
      await this.cloudinaryService.deleteImages([uploadedImage.publicId]);
      throw error;
    }
  }

  private async findNearbyLostReports(
    dto: CreateCatSightingRequestDto,
    reporterId: string,
  ): Promise<NearbyLostReport[]> {
    return this.lostCatReportModel.aggregate<NearbyLostReport>([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [dto.longitude, dto.latitude],
          },
          distanceField: 'distanceMeters',
          maxDistance: dto.matchRadiusKm * 1000,
          spherical: true,
          query: {
            status: 'active',
            ownerId: { $ne: new Types.ObjectId(reporterId) },
          },
        },
      },
      { $sort: { distanceMeters: 1, createdAt: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 1,
          catId: 1,
          ownerId: 1,
          distanceMeters: 1,
        },
      },
    ]);
  }

  private async createOwnerNotifications(
    sightingId: Types.ObjectId,
    user: RequestUser,
    candidates: {
      lostCatReportId: Types.ObjectId;
      catId: Types.ObjectId;
      ownerId: Types.ObjectId;
      distanceMeters: number;
      status: 'pending_owner_review';
    }[],
  ): Promise<number> {
    if (!candidates.length) {
      return 0;
    }

    const cats = await this.catModel.find({
      _id: { $in: candidates.map((candidate) => candidate.catId) },
    });
    const catsById = new Map(cats.map((cat) => [cat._id.toString(), cat]));

    const notifications = candidates.map((candidate) => {
      const cat = catsById.get(candidate.catId.toString());
      const catName = cat?.name ?? 'mèo của bạn';

      return {
        recipientId: candidate.ownerId,
        actorId: new Types.ObjectId(user.id),
        type: 'cat_sighting_match',
        title: 'Có người báo thấy mèo giống mèo của bạn',
        body: `${user.fullName || user.username} đã báo thấy một bé mèo gần vị trí tin tìm của ${catName}.`,
        data: {
          sightingId: sightingId.toString(),
          lostCatReportId: candidate.lostCatReportId.toString(),
          catId: candidate.catId.toString(),
          distanceMeters: candidate.distanceMeters,
        },
      };
    });

    const insertedNotifications =
      await this.notificationModel.insertMany(notifications);
    await Promise.all(
      insertedNotifications.map((notification) =>
        this.pushNotificationService.sendToUser({
          recipientId: notification.recipientId,
          title: notification.title,
          body: notification.body,
          data: {
            notificationId: notification._id.toString(),
            type: notification.type,
            ...notification.data,
          },
        }),
      ),
    );

    return notifications.length;
  }
}
