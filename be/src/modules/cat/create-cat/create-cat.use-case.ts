import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cat, CatDocument } from '../../../models/cat.schema';
import { CreateCatProfileRequestDto } from './dto/create-cat.request.dto';
import { CreateCatProfileResponseDto } from './dto/create-cat.response.dto';
import {
  CloudinaryService,
  UploadedImage,
} from '../../../common/services/cloudinary.service';

interface RequestUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

const MAX_IMAGES = 5;

@Injectable()
export class CreateCatProfileUseCase {
  constructor(
    @InjectModel(Cat.name) private readonly catModel: Model<CatDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(
    dto: CreateCatProfileRequestDto,
    files: Express.Multer.File[],
    user: RequestUser,
  ): Promise<CreateCatProfileResponseDto> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Cần ít nhất 1 ảnh cho hồ sơ mèo');
    }

    if (files.length > MAX_IMAGES) {
      throw new BadRequestException('Chỉ được tải tối đa 5 ảnh');
    }

    let images: UploadedImage[];
    try {
      images = await this.cloudinaryService.uploadCatImages(files);
    } catch (error) {
      throw new InternalServerErrorException(
        'Không thể tải ảnh lên Cloudinary',
      );
    }

    const cat = await this.catModel.create({
      ownerId: new Types.ObjectId(user.id),
      name: dto.name.trim(),
      ageMonths: dto.ageMonths,
      breed: dto.breed.trim(),
      furColor: dto.furColor.trim(),
      distinctiveFeatures: dto.distinctiveFeatures.trim(),
      images,
    });

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
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
      },
    };
  }
}
