import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryService } from '../../common/services/cloudinary.service';
import { Cat, CatSchema } from '../../models/cat.schema';
import { Feed, FeedSchema } from '../../models/feed.schema';
import { AuthModule } from '../auth/auth.module';
import { CreateFeedController } from './create-feed/create-feed.controller';
import { CreateFeedUseCase } from './create-feed/create-feed.use-case';
import { FeedReadController } from './feed-read.controller';
import { GetFeedDetailUseCase } from './get-feed-detail/get-feed-detail.use-case';
import { GetFeedsUseCase } from './get-feeds/get-feeds.use-case';
import { ReactFeedUseCase } from './react-feed/react-feed.use-case';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Feed.name, schema: FeedSchema },
      { name: Cat.name, schema: CatSchema },
    ]),
  ],
  controllers: [CreateFeedController, FeedReadController],
  providers: [
    CreateFeedUseCase,
    GetFeedsUseCase,
    GetFeedDetailUseCase,
    ReactFeedUseCase,
    CloudinaryService,
  ],
})
export class FeedModule {}
