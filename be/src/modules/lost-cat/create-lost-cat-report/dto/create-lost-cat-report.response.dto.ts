export class CreateLostCatReportResponseDto {
  success!: boolean;
  report!: {
    id: string;
    catId: string;
    ownerId: string;
    locationText: string;
    latitude: number;
    longitude: number;
    description: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
