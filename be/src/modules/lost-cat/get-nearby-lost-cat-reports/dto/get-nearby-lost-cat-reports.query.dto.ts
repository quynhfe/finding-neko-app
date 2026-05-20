import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsNumber, Max, Min } from 'class-validator';

export class GetNearbyLostCatReportsQueryDto {
  @Type(() => Number)
  @IsLatitude({ message: 'Latitude không hợp lệ' })
  latitude!: number;

  @Type(() => Number)
  @IsLongitude({ message: 'Longitude không hợp lệ' })
  longitude!: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'Bán kính phải là số' })
  @Min(0.1)
  @Max(50)
  radiusKm = 5;
}
