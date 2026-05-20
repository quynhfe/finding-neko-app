import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cat, CatDocument } from '../../../models/cat.schema';
import { GetMyCatsResponseDto } from './dto/get-my-cats.response.dto';

interface RequestUser {
  id: string;
}

@Injectable()
export class GetMyCatsUseCase {
  constructor(
    @InjectModel(Cat.name) private readonly catModel: Model<CatDocument>,
  ) {}

  async execute(user: RequestUser): Promise<GetMyCatsResponseDto> {
    const cats = await this.catModel
      .find({ ownerId: new Types.ObjectId(user.id) })
      .sort({ createdAt: -1 });

    return {
      success: true,
      cats: cats.map((cat) => ({
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
      })),
    };
  }
}
