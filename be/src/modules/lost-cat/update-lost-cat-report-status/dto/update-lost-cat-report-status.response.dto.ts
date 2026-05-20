import { LostCatReportItemDto } from '../../dto/lost-cat-report-item.dto';

export class UpdateLostCatReportStatusResponseDto {
  success!: boolean;
  report!: LostCatReportItemDto;
}
