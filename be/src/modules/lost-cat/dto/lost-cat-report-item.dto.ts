export interface LostCatReportItemDto {
  id: string;
  catId: string;
  ownerId: string;
  locationText: string;
  latitude: number;
  longitude: number;
  description: string;
  status: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
