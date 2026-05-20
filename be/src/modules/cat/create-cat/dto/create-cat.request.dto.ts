import { Type } from 'class-transformer';
import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateCatProfileRequestDto {
  @IsString()
  @MinLength(1, { message: 'Tên mèo không được để trống' })
  @MaxLength(80)
  name!: string;

  @Type(() => Number)
  @IsInt({ message: 'Tuổi (tháng) phải là số nguyên' })
  @Min(0)
  @Max(240)
  ageMonths!: number;

  @IsString()
  @MinLength(1, { message: 'Giống mèo không được để trống' })
  @MaxLength(80)
  breed!: string;

  @IsString()
  @MinLength(1, { message: 'Màu lông không được để trống' })
  @MaxLength(40)
  furColor!: string;

  @IsString()
  @MinLength(1, { message: 'Đặc điểm nhận dạng không được để trống' })
  @MaxLength(500)
  distinctiveFeatures!: string;
}
