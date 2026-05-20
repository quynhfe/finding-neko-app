import { Controller, Get, Query } from '@nestjs/common';
import { GetNearbyLostCatReportsUseCase } from './get-nearby-lost-cat-reports.use-case';
import { GetNearbyLostCatReportsQueryDto } from './dto/get-nearby-lost-cat-reports.query.dto';
import { GetNearbyLostCatReportsResponseDto } from './dto/get-nearby-lost-cat-reports.response.dto';

@Controller('lost-cats')
export class GetNearbyLostCatReportsController {
  constructor(
    private readonly getNearbyLostCatReportsUseCase: GetNearbyLostCatReportsUseCase,
  ) {}

  @Get('nearby')
  async getNearbyLostCatReports(
    @Query() query: GetNearbyLostCatReportsQueryDto,
  ): Promise<GetNearbyLostCatReportsResponseDto> {
    return this.getNearbyLostCatReportsUseCase.execute(query);
  }
}
