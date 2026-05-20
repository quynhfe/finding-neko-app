import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCatSightingRequestDto {
  @IsString()
  @MinLength(1, { message: 'Vị trí không được để trống' })
  @MaxLength(200)
  locationText!: string;

  @Type(() => Number)
  @IsLatitude({ message: 'Latitude không hợp lệ' })
  latitude!: number;

  @Type(() => Number)
  @IsLongitude({ message: 'Longitude không hợp lệ' })
  longitude!: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Bán kính phải là số' })
  @Min(0.1)
  @Max(10)
  matchRadiusKm = 3;
}
