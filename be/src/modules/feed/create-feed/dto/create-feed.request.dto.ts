import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

const normalizeCatIds = (value: unknown): unknown[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return [];
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(trimmedValue);
    if (Array.isArray(parsedValue)) {
      return parsedValue;
    }
  } catch {
    // Fall back to comma-separated form-data values.
  }

  return trimmedValue.split(',').map((catId) => catId.trim());
};

export class CreateFeedRequestDto {
  @IsString()
  @MinLength(1, { message: 'Nội dung bài đăng không được để trống' })
  @MaxLength(280)
  caption!: string;

  @Transform(({ value }) => normalizeCatIds(value))
  @IsArray({ message: 'Danh sách mèo phải là một mảng' })
  @ArrayMinSize(1, { message: 'Cần chọn ít nhất 1 mèo trong bài đăng' })
  @ArrayMaxSize(20)
  @IsMongoId({ each: true, message: 'ID mèo không hợp lệ' })
  catIds!: string[];
}
