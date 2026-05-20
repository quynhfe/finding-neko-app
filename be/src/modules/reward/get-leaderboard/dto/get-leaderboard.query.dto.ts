import { IsIn, IsOptional } from 'class-validator';

export class GetLeaderboardQueryDto {
  @IsOptional()
  @IsIn(['week', 'month', 'all'])
  period: 'week' | 'month' | 'all' = 'week';
}
