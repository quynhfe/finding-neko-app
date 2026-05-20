import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  StarReward,
  StarRewardDocument,
} from '../../../models/star-reward.schema';
import { GetLeaderboardQueryDto } from './dto/get-leaderboard.query.dto';
import { GetLeaderboardResponseDto } from './dto/get-leaderboard.response.dto';

interface LeaderboardRow {
  _id: Types.ObjectId;
  totalStars: number;
  catsFound: number;
  user?: {
    username?: string;
    fullName?: string;
  };
}

@Injectable()
export class GetLeaderboardUseCase {
  constructor(
    @InjectModel(StarReward.name)
    private readonly starRewardModel: Model<StarRewardDocument>,
  ) {}

  async execute(
    query: GetLeaderboardQueryDto,
  ): Promise<GetLeaderboardResponseDto> {
    const match = this.buildPeriodMatch(query.period);
    const rows = await this.starRewardModel.aggregate<LeaderboardRow>([
      ...(match ? [{ $match: match }] : []),
      {
        $group: {
          _id: '$recipientId',
          totalStars: { $sum: '$stars' },
          catsFound: { $sum: 1 },
        },
      },
      { $sort: { totalStars: -1, catsFound: -1, _id: 1 } },
      { $limit: 50 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          totalStars: 1,
          catsFound: 1,
          'user.username': 1,
          'user.fullName': 1,
        },
      },
    ]);

    return {
      success: true,
      period: query.period,
      updatedAt: new Date(),
      rankings: rows.map((row, index) => ({
        rank: index + 1,
        userId: row._id.toString(),
        username: row.user?.username ?? 'unknown',
        fullName: row.user?.fullName ?? row.user?.username ?? 'Unknown',
        totalStars: row.totalStars,
        catsFound: row.catsFound,
      })),
    };
  }

  private buildPeriodMatch(
    period: 'week' | 'month' | 'all',
  ): { createdAt: { $gte: Date } } | undefined {
    if (period === 'all') {
      return undefined;
    }

    const startDate = new Date();
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    return { createdAt: { $gte: startDate } };
  }
}
