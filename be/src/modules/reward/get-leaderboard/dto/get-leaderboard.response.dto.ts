export class GetLeaderboardResponseDto {
  success!: boolean;
  period!: string;
  updatedAt!: Date;
  rankings!: {
    rank: number;
    userId: string;
    username: string;
    fullName: string;
    totalStars: number;
    catsFound: number;
  }[];
}
