import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RegisterPushTokenUseCase } from './register-push-token/register-push-token.use-case';
import { RegisterPushTokenRequestDto } from './register-push-token/dto/register-push-token.request.dto';
import { RegisterPushTokenResponseDto } from './register-push-token/dto/register-push-token.response.dto';
import { UnregisterPushTokenUseCase } from './unregister-push-token/unregister-push-token.use-case';
import { UnregisterPushTokenRequestDto } from './unregister-push-token/dto/unregister-push-token.request.dto';
import { UnregisterPushTokenResponseDto } from './unregister-push-token/dto/unregister-push-token.response.dto';

interface RequestUser {
  id: string;
}

@Controller('devices')
export class DeviceController {
  constructor(
    private readonly registerPushTokenUseCase: RegisterPushTokenUseCase,
    private readonly unregisterPushTokenUseCase: UnregisterPushTokenUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('push-token')
  async registerPushToken(
    @Body() dto: RegisterPushTokenRequestDto,
    @CurrentUser() user: RequestUser,
  ): Promise<RegisterPushTokenResponseDto> {
    return this.registerPushTokenUseCase.execute(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('push-token')
  async unregisterPushToken(
    @Body() dto: UnregisterPushTokenRequestDto,
    @CurrentUser() user: RequestUser,
  ): Promise<UnregisterPushTokenResponseDto> {
    return this.unregisterPushTokenUseCase.execute(dto, user);
  }
}
