import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterUseCase } from './register.use-case';
import { RegisterRequestDto } from './dto/register.request.dto';
import {
  RegisterStartResponseDto,
  VerifyRegisterOtpResponseDto,
} from './dto/register.response.dto';
import { VerifyRegisterOtpRequestDto } from './dto/verify-register-otp.request.dto';

@Controller('auth')
export class RegisterController {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterRequestDto,
  ): Promise<RegisterStartResponseDto> {
    return this.registerUseCase.execute(dto);
  }

  @Post('register/verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() dto: VerifyRegisterOtpRequestDto,
  ): Promise<VerifyRegisterOtpResponseDto> {
    return this.registerUseCase.verifyOtp(dto);
  }
}
