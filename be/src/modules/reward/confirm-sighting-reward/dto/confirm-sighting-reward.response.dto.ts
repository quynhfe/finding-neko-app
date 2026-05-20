export class ConfirmSightingRewardResponseDto {
  success!: boolean;
  reward!: {
    id: string;
    recipientId: string;
    awardedBy: string;
    catId: string;
    lostCatReportId: string;
    sightingId: string;
    stars: number;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
