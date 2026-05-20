export class GetCatSightingDetailResponseDto {
  success!: boolean;
  sighting!: {
    id: string;
    reporterId: string;
    image: {
      url: string;
      publicId: string;
    };
    locationText: string;
    latitude: number;
    longitude: number;
    description: string;
    candidates: {
      lostCatReportId: string;
      catId: string;
      ownerId: string;
      distanceMeters: number;
      status: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
  };
}
