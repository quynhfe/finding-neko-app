import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateFeedUseCase } from './create-feed.use-case';
import { CreateFeedRequestDto } from './dto/create-feed.request.dto';
import { CreateFeedResponseDto } from './dto/create-feed.response.dto';

interface RequestUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Controller('feeds')
export class CreateFeedController {
  constructor(private readonly createFeedUseCase: CreateFeedUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: {
        fileSize: MAX_IMAGE_SIZE_BYTES,
        files: 1,
      },
      fileFilter: (_request, file, callback) => {
        if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
          callback(
            new BadRequestException('Ảnh chỉ hỗ trợ định dạng JPG, PNG hoặc WEBP'),
            false,
          );
          return;
        }

        callback(null, true);
      },
    }),
  )
  async createFeed(
    @Body() dto: CreateFeedRequestDto,
    @UploadedFile() imageFile: Express.Multer.File | undefined,
    @CurrentUser() user: RequestUser,
  ): Promise<CreateFeedResponseDto> {
    return this.createFeedUseCase.execute(dto, imageFile, user);
  }
}
