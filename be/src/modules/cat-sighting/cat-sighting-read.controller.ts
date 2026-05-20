import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCatSightingDetailUseCase } from './get-cat-sighting-detail/get-cat-sighting-detail.use-case';
import { GetCatSightingDetailResponseDto } from './get-cat-sighting-detail/dto/get-cat-sighting-detail.response.dto';

interface RequestUser {
  id: string;
}

@Controller('cat-sightings')
export class CatSightingReadController {
  constructor(
    private readonly getCatSightingDetailUseCase: GetCatSightingDetailUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getCatSightingDetail(
    @Param('id') sightingId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<GetCatSightingDetailResponseDto> {
    return this.getCatSightingDetailUseCase.execute(sightingId, user);
  }
}
