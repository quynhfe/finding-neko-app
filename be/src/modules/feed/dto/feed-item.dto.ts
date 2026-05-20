export interface FeedItemDto {
  id: string;
  ownerId: string;
  caption: string;
  catIds: string[];
  image: {
    url: string;
    publicId: string;
  };
  reactionCount: number;
  reactedByMe: boolean;
  createdAt: Date;
  updatedAt: Date;
}
