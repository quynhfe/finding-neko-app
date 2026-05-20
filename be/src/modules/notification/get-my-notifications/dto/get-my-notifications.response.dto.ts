export class GetMyNotificationsResponseDto {
  success!: boolean;
  notifications!: {
    id: string;
    recipientId: string;
    actorId: string;
    type: string;
    title: string;
    body: string;
    data: Record<string, unknown>;
    readAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }[];
}
