import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cat, CatDocument } from '../../../models/cat.schema';
import { CloudinaryService } from '../../../common/services/cloudinary.service';
import { DeleteCatProfileResponseDto } from './dto/delete-cat.response.dto';

interface RequestUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

@Injectable()
export class DeleteCatProfileUseCase {
  constructor(
    @InjectModel(Cat.name) private readonly catModel: Model<CatDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(
    catId: string,
    user: RequestUser,
  ): Promise<DeleteCatProfileResponseDto> {
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

    const publicIds = cat.images.map((image) => image.publicId);
    try {
      await this.cloudinaryService.deleteImages(publicIds);
    } catch (error) {
      throw new InternalServerErrorException(
        'Không thể xóa ảnh hồ sơ mèo trên Cloudinary',
      );
    }

    await this.catModel.deleteOne({ _id: cat._id });

    return {
      success: true,
      message: 'Đã xóa hồ sơ mèo',
      deletedCatId: cat._id.toString(),
    };
  }
}
