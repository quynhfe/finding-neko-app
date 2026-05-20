import { Type } from 'class-transformer';
import { IsMongoId, IsOptional, Max, Min } from 'class-validator';

export class GetFeedsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  limit = 20;

  @IsOptional()
  @IsMongoId({ message: 'Cursor không hợp lệ' })
  cursor?: string;
}
