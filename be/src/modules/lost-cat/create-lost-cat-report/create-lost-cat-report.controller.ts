import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateLostCatReportUseCase } from './create-lost-cat-report.use-case';
import { CreateLostCatReportRequestDto } from './dto/create-lost-cat-report.request.dto';
import { CreateLostCatReportResponseDto } from './dto/create-lost-cat-report.response.dto';

interface RequestUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

@Controller('lost-cats')
export class CreateLostCatReportController {
  constructor(
    private readonly createLostCatReportUseCase: CreateLostCatReportUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createLostCatReport(
    @Body() dto: CreateLostCatReportRequestDto,
    @CurrentUser() user: RequestUser,
  ): Promise<CreateLostCatReportResponseDto> {
    return this.createLostCatReportUseCase.execute(dto, user);
  }
}
