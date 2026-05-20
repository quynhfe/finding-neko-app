import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Feed, FeedDocument } from '../../../models/feed.schema';
import { ReactFeedResponseDto } from './dto/react-feed.response.dto';

interface RequestUser {
  id: string;
}

@Injectable()
export class ReactFeedUseCase {
  constructor(
    @InjectModel(Feed.name) private readonly feedModel: Model<FeedDocument>,
  ) {}

  async addLove(feedId: string, user: RequestUser): Promise<ReactFeedResponseDto> {
    if (!Types.ObjectId.isValid(feedId)) {
      throw new BadRequestException('ID bài đăng không hợp lệ');
    }

    const userId = new Types.ObjectId(user.id);
    const feed = await this.feedModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(feedId),
        'reactions.userId': { $ne: userId },
      },
      {
        $push: {
          reactions: {
            userId,
            type: 'love',
            createdAt: new Date(),
          },
        },
      },
      { new: true },
    );

    const currentFeed = feed ?? (await this.feedModel.findById(feedId));
    if (!currentFeed) {
      throw new NotFoundException('Không tìm thấy bài đăng');
    }

    return {
      success: true,
      feedId: currentFeed._id.toString(),
      reactionCount: currentFeed.reactions.length,
      reactedByMe: currentFeed.reactions.some((reaction) =>
        reaction.userId.equals(userId),
      ),
    };
  }

  async removeLove(feedId: string, user: RequestUser): Promise<ReactFeedResponseDto> {
    if (!Types.ObjectId.isValid(feedId)) {
      throw new BadRequestException('ID bài đăng không hợp lệ');
    }

    const userId = new Types.ObjectId(user.id);
    const feed = await this.feedModel.findOneAndUpdate(
      { _id: new Types.ObjectId(feedId) },
      { $pull: { reactions: { userId } } },
      { new: true },
    );

    if (!feed) {
      throw new NotFoundException('Không tìm thấy bài đăng');
    }

    return {
      success: true,
      feedId: feed._id.toString(),
      reactionCount: feed.reactions.length,
      reactedByMe: false,
    };
  }
}
