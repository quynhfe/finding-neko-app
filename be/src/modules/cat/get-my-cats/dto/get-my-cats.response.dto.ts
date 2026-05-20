export class GetMyCatsResponseDto {
  success!: boolean;
  cats!: {
    id: string;
    ownerId: string;
    name: string;
    ageMonths: number;
    breed: string;
    furColor: string;
    distinctiveFeatures: string;
    images: {
      url: string;
      publicId: string;
    }[];
    isLost: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
}
