import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConfirmSightingRewardUseCase } from './confirm-sighting-reward/confirm-sighting-reward.use-case';
import { ConfirmSightingRewardResponseDto } from './confirm-sighting-reward/dto/confirm-sighting-reward.response.dto';
import { GetLeaderboardUseCase } from './get-leaderboard/get-leaderboard.use-case';
import { GetLeaderboardQueryDto } from './get-leaderboard/dto/get-leaderboard.query.dto';
import { GetLeaderboardResponseDto } from './get-leaderboard/dto/get-leaderboard.response.dto';

interface RequestUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

@Controller()
export class RewardController {
  constructor(
    private readonly confirmSightingRewardUseCase: ConfirmSightingRewardUseCase,
    private readonly getLeaderboardUseCase: GetLeaderboardUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('cat-sightings/:sightingId/candidates/:lostCatReportId/confirm')
  async confirmSightingReward(
    @Param('sightingId') sightingId: string,
    @Param('lostCatReportId') lostCatReportId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<ConfirmSightingRewardResponseDto> {
    return this.confirmSightingRewardUseCase.execute(
      sightingId,
      lostCatReportId,
      user,
    );
  }

  @Get('leaderboards')
  async getLeaderboard(
    @Query() query: GetLeaderboardQueryDto,
  ): Promise<GetLeaderboardResponseDto> {
    return this.getLeaderboardUseCase.execute(query);
  }
}
