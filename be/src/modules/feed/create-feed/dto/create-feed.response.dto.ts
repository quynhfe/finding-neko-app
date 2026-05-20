export class CreateFeedResponseDto {
  success!: boolean;
  feed!: {
    id: string;
    ownerId: string;
    caption: string;
    catIds: string[];
    image: {
      url: string;
      publicId: string;
    };
    reactionCount: number;
    createdAt: Date;
    updatedAt: Date;
  };
}
