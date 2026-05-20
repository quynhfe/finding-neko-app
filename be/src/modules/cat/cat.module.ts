import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Cat, CatSchema } from '../../models/cat.schema';
import { CloudinaryService } from '../../common/services/cloudinary.service';
import { CreateCatProfileController } from './create-cat/create-cat.controller';
import { CreateCatProfileUseCase } from './create-cat/create-cat.use-case';
import { DeleteCatProfileController } from './delete-cat/delete-cat.controller';
import { DeleteCatProfileUseCase } from './delete-cat/delete-cat.use-case';
import { GetCatController } from './get-cat.controller';
import { GetCatDetailUseCase } from './get-cat-detail/get-cat-detail.use-case';
import { GetMyCatsUseCase } from './get-my-cats/get-my-cats.use-case';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
  ],
  controllers: [
    CreateCatProfileController,
    DeleteCatProfileController,
    GetCatController,
  ],
  providers: [
    CreateCatProfileUseCase,
    DeleteCatProfileUseCase,
    GetMyCatsUseCase,
    GetCatDetailUseCase,
    CloudinaryService,
  ],
})
export class CatModule {}
