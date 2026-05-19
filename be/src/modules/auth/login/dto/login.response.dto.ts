export class LoginResponseDto {
  success!: boolean;
  accessToken!: string;
  user!: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}
