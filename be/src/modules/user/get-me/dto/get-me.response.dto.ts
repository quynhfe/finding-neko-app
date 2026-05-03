export class GetMeResponseDto {
  success: boolean;
  user: {
    id: string;
    email: string;
    role: string;
  };
}
