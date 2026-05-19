export class GetMeResponseDto {
  success!: boolean;
  user!: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
  };
}
