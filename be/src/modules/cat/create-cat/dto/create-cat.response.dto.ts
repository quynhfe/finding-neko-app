export class CreateCatProfileResponseDto {
  success!: boolean;
  cat!: {
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
    createdAt: Date;
    updatedAt: Date;
  };
}
