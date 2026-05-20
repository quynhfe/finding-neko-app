import { FeedItemDto } from '../../dto/feed-item.dto';

export class GetFeedDetailResponseDto {
  success!: boolean;
  feed!: FeedItemDto;
}
