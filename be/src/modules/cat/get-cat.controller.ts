import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCatDetailUseCase } from './get-cat-detail/get-cat-detail.use-case';
import { GetCatDetailResponseDto } from './get-cat-detail/dto/get-cat-detail.response.dto';
import { GetMyCatsUseCase } from './get-my-cats/get-my-cats.use-case';
import { GetMyCatsResponseDto } from './get-my-cats/dto/get-my-cats.response.dto';

interface RequestUser {
  id: string;
}

@Controller('cats')
export class GetCatController {
  constructor(
    private readonly getMyCatsUseCase: GetMyCatsUseCase,
    private readonly getCatDetailUseCase: GetCatDetailUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyCats(@CurrentUser() user: RequestUser): Promise<GetMyCatsResponseDto> {
    return this.getMyCatsUseCase.execute(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getCatDetail(
    @Param('id') catId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<GetCatDetailResponseDto> {
    return this.getCatDetailUseCase.execute(catId, user);
  }
}
