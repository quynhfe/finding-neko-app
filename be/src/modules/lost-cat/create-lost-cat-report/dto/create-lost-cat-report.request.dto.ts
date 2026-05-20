import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsMongoId,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateLostCatReportRequestDto {
  @IsMongoId({ message: 'ID mèo không hợp lệ' })
  catId!: string;

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

  @IsString()
  @MinLength(1, { message: 'Mô tả không được để trống' })
  @MaxLength(1000)
  description!: string;
}
