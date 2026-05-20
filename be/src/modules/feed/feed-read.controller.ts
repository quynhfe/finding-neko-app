import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetFeedDetailUseCase } from './get-feed-detail/get-feed-detail.use-case';
import { GetFeedDetailResponseDto } from './get-feed-detail/dto/get-feed-detail.response.dto';
import { GetFeedsUseCase } from './get-feeds/get-feeds.use-case';
import { GetFeedsQueryDto } from './get-feeds/dto/get-feeds.query.dto';
import { GetFeedsResponseDto } from './get-feeds/dto/get-feeds.response.dto';
import { ReactFeedUseCase } from './react-feed/react-feed.use-case';
import { ReactFeedResponseDto } from './react-feed/dto/react-feed.response.dto';

interface RequestUser {
  id: string;
}

@Controller('feeds')
export class FeedReadController {
  constructor(
    private readonly getFeedsUseCase: GetFeedsUseCase,
    private readonly getFeedDetailUseCase: GetFeedDetailUseCase,
    private readonly reactFeedUseCase: ReactFeedUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getFeeds(
    @Query() query: GetFeedsQueryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<GetFeedsResponseDto> {
    return this.getFeedsUseCase.execute(query, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getFeedDetail(
    @Param('id') feedId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<GetFeedDetailResponseDto> {
    return this.getFeedDetailUseCase.execute(feedId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reactions')
  async addLoveReaction(
    @Param('id') feedId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<ReactFeedResponseDto> {
    return this.reactFeedUseCase.addLove(feedId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/reactions/me')
  async removeLoveReaction(
    @Param('id') feedId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<ReactFeedResponseDto> {
    return this.reactFeedUseCase.removeLove(feedId, user);
  }
}
