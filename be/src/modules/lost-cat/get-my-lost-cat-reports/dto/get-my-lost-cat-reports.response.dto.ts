import { LostCatReportItemDto } from '../../dto/lost-cat-report-item.dto';

export class GetMyLostCatReportsResponseDto {
  success!: boolean;
  reports!: LostCatReportItemDto[];
}
