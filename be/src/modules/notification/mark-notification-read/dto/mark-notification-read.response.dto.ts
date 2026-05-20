export class MarkNotificationReadResponseDto {
  success!: boolean;
  notification!: {
    id: string;
    readAt: Date;
  };
}
