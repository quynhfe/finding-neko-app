import { FeedItemDto } from '../../dto/feed-item.dto';

export class GetFeedsResponseDto {
  success!: boolean;
  feeds!: FeedItemDto[];
  nextCursor?: string;
}
