export class GetNearbyLostCatReportsResponseDto {
  success!: boolean;
  reports!: {
    id: string;
    catId: string;
    ownerId: string;
    catName: string;
    catImages: {
      url: string;
      publicId: string;
    }[];
    locationText: string;
    latitude: number;
    longitude: number;
    description: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}
