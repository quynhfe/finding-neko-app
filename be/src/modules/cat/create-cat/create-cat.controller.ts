import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCatProfileUseCase } from './create-cat.use-case';
import { CreateCatProfileRequestDto } from './dto/create-cat.request.dto';
import { CreateCatProfileResponseDto } from './dto/create-cat.response.dto';

interface RequestUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Controller('cats')
export class CreateCatProfileController {
  constructor(private readonly createCatProfileUseCase: CreateCatProfileUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', MAX_IMAGES, {
      storage: memoryStorage(),
      limits: {
        fileSize: MAX_IMAGE_SIZE_BYTES,
        files: MAX_IMAGES,
      },
      fileFilter: (_request, file, callback) => {
        if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
          callback(
            new BadRequestException('Anh chi ho tro dinh dang JPG, PNG hoac WEBP'),
            false,
          );
          return;
        }

        callback(null, true);
      },
    }),
  )
  async createCatProfile(
    @Body() dto: CreateCatProfileRequestDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: RequestUser,
  ): Promise<CreateCatProfileResponseDto> {
    return this.createCatProfileUseCase.execute(dto, files, user);
  }
}
