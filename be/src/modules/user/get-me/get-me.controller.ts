import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { GetMeUseCase } from './get-me.use-case';
import { GetMeResponseDto } from './dto/get-me.response.dto';

@Controller('users')
export class GetMeController {
  constructor(private readonly getMeUseCase: GetMeUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(
    @CurrentUser() user: { id: string; email: string; role: string },
  ): Promise<GetMeResponseDto> {
    return this.getMeUseCase.execute(user);
  }
}
