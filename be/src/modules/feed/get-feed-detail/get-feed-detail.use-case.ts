import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Feed, FeedDocument } from '../../../models/feed.schema';
import { GetFeedDetailResponseDto } from './dto/get-feed-detail.response.dto';

interface RequestUser {
  id?: string;
}

@Injectable()
export class GetFeedDetailUseCase {
  constructor(
    @InjectModel(Feed.name) private readonly feedModel: Model<FeedDocument>,
  ) {}

  async execute(
    feedId: string,
    user?: RequestUser,
  ): Promise<GetFeedDetailResponseDto> {
    if (!Types.ObjectId.isValid(feedId)) {
      throw new BadRequestException('ID bài đăng không hợp lệ');
    }

    const feed = await this.feedModel.findById(feedId);
    if (!feed) {
      throw new NotFoundException('Không tìm thấy bài đăng');
    }

    const userId = user?.id ? new Types.ObjectId(user.id) : undefined;

    return {
      success: true,
      feed: {
        id: feed._id.toString(),
        ownerId: feed.ownerId.toString(),
        caption: feed.caption,
        catIds: feed.catIds.map((catId) => catId.toString()),
        image: feed.image,
        reactionCount: feed.reactions.length,
        reactedByMe: userId
          ? feed.reactions.some((reaction) => reaction.userId.equals(userId))
          : false,
        createdAt: feed.createdAt,
        updatedAt: feed.updatedAt,
      },
    };
  }
}
