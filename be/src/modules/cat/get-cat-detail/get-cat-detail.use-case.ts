import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cat, CatDocument } from '../../../models/cat.schema';
import { GetCatDetailResponseDto } from './dto/get-cat-detail.response.dto';

interface RequestUser {
  id: string;
}

@Injectable()
export class GetCatDetailUseCase {
  constructor(
    @InjectModel(Cat.name) private readonly catModel: Model<CatDocument>,
  ) {}

  async execute(catId: string, user: RequestUser): Promise<GetCatDetailResponseDto> {
    if (!Types.ObjectId.isValid(catId)) {
      throw new BadRequestException('ID hồ sơ mèo không hợp lệ');
    }

    const cat = await this.catModel.findOne({
      _id: new Types.ObjectId(catId),
      ownerId: new Types.ObjectId(user.id),
    });

    if (!cat) {
      throw new NotFoundException('Không tìm thấy hồ sơ mèo');
    }

    return {
      success: true,
      cat: {
        id: cat._id.toString(),
        ownerId: cat.ownerId.toString(),
        name: cat.name,
        ageMonths: cat.ageMonths,
        breed: cat.breed,
        furColor: cat.furColor,
        distinctiveFeatures: cat.distinctiveFeatures,
        images: cat.images,
        isLost: cat.isLost,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
      },
    };
  }
}
