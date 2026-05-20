import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Feed, FeedDocument } from '../../../models/feed.schema';
import { GetFeedsQueryDto } from './dto/get-feeds.query.dto';
import { GetFeedsResponseDto } from './dto/get-feeds.response.dto';

interface RequestUser {
  id?: string;
}

@Injectable()
export class GetFeedsUseCase {
  constructor(
    @InjectModel(Feed.name) private readonly feedModel: Model<FeedDocument>,
  ) {}

  async execute(
    query: GetFeedsQueryDto,
    user?: RequestUser,
  ): Promise<GetFeedsResponseDto> {
    const filter: Record<string, unknown> = {};
    if (query.cursor) {
      filter._id = { $lt: new Types.ObjectId(query.cursor) };
    }

    const limit = query.limit;
    const feeds = await this.feedModel
      .find(filter)
      .sort({ _id: -1 })
      .limit(limit + 1);
    const hasNextPage = feeds.length > limit;
    const pageItems = feeds.slice(0, limit);
    const userId = user?.id ? new Types.ObjectId(user.id) : undefined;

    return {
      success: true,
      feeds: pageItems.map((feed) => ({
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
      })),
      nextCursor: hasNextPage ? pageItems[pageItems.length - 1]?._id.toString() : undefined,
    };
  }
}
