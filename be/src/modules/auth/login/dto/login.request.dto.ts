import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @MinLength(3, { message: 'Email hoặc username không hợp lệ' })
  @MaxLength(254)
  identifier!: string;

  @IsString()
  @MinLength(6, { message: 'Password phải có ít nhất 6 ký tự' })
  password!: string;
}
