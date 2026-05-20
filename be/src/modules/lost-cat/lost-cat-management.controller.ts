import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetMyLostCatReportsUseCase } from './get-my-lost-cat-reports/get-my-lost-cat-reports.use-case';
import { GetMyLostCatReportsResponseDto } from './get-my-lost-cat-reports/dto/get-my-lost-cat-reports.response.dto';
import { UpdateLostCatReportStatusUseCase } from './update-lost-cat-report-status/update-lost-cat-report-status.use-case';
import { UpdateLostCatReportStatusResponseDto } from './update-lost-cat-report-status/dto/update-lost-cat-report-status.response.dto';

interface RequestUser {
  id: string;
}

@Controller('lost-cats')
export class LostCatManagementController {
  constructor(
    private readonly getMyLostCatReportsUseCase: GetMyLostCatReportsUseCase,
    private readonly updateLostCatReportStatusUseCase: UpdateLostCatReportStatusUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyReports(
    @CurrentUser() user: RequestUser,
  ): Promise<GetMyLostCatReportsResponseDto> {
    return this.getMyLostCatReportsUseCase.execute(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  async cancelReport(
    @Param('id') reportId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<UpdateLostCatReportStatusResponseDto> {
    return this.updateLostCatReportStatusUseCase.execute(
      reportId,
      'cancelled',
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/resolve')
  async resolveReport(
    @Param('id') reportId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<UpdateLostCatReportStatusResponseDto> {
    return this.updateLostCatReportStatusUseCase.execute(
      reportId,
      'resolved',
      user,
    );
  }
}
