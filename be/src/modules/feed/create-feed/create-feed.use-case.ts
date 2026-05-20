import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from '../../../common/services/cloudinary.service';
import { Cat, CatDocument } from '../../../models/cat.schema';
import { Feed, FeedDocument } from '../../../models/feed.schema';
import { CreateFeedRequestDto } from './dto/create-feed.request.dto';
import { CreateFeedResponseDto } from './dto/create-feed.response.dto';

interface RequestUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

@Injectable()
export class CreateFeedUseCase {
  constructor(
    @InjectModel(Feed.name) private readonly feedModel: Model<FeedDocument>,
    @InjectModel(Cat.name) private readonly catModel: Model<CatDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(
    dto: CreateFeedRequestDto,
    imageFile: Express.Multer.File | undefined,
    user: RequestUser,
  ): Promise<CreateFeedResponseDto> {
    if (!imageFile) {
      throw new BadRequestException('Cần tải lên 1 ảnh cho bài đăng');
    }

    const uniqueCatIds = [...new Set(dto.catIds)];
    const catObjectIds = uniqueCatIds.map((catId) => new Types.ObjectId(catId));
    const ownedCatCount = await this.catModel.countDocuments({
      _id: { $in: catObjectIds },
      ownerId: new Types.ObjectId(user.id),
    });

    if (ownedCatCount !== uniqueCatIds.length) {
      throw new BadRequestException('Chỉ được chọn mèo thuộc hồ sơ của bạn');
    }

    let uploadedImage: { url: string; publicId: string };
    try {
      uploadedImage = await this.cloudinaryService.uploadFeedImage(imageFile);
    } catch (error) {
      throw new InternalServerErrorException(
        'Không thể tải ảnh bài đăng lên Cloudinary',
      );
    }

    try {
      const feed = await this.feedModel.create({
        ownerId: new Types.ObjectId(user.id),
        caption: dto.caption.trim(),
        catIds: catObjectIds,
        image: uploadedImage,
        reactions: [],
      });

      return {
        success: true,
        feed: {
          id: feed._id.toString(),
          ownerId: feed.ownerId.toString(),
          caption: feed.caption,
          catIds: feed.catIds.map((catId) => catId.toString()),
          image: feed.image,
          reactionCount: feed.reactions.length,
          createdAt: feed.createdAt,
          updatedAt: feed.updatedAt,
        },
      };
    } catch (error) {
      await this.cloudinaryService.deleteImages([uploadedImage.publicId]);
      throw error;
    }
  }
}
