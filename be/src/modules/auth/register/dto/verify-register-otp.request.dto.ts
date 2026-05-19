import {
  IsEmail,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class VerifyRegisterOtpRequestDto {
  @IsString()
  @MinLength(3, { message: 'Username phải có ít nhất 3 ký tự' })
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username chỉ được chứa chữ, số và dấu gạch dưới',
  })
  username!: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(254)
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password phải có ít nhất 6 ký tự' })
  @MaxLength(64)
  password!: string;

  @IsString()
  @Length(6, 6, { message: 'OTP phải gồm 6 chữ số' })
  otp!: string;
}
