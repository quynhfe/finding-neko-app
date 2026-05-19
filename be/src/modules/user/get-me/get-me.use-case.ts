import { Injectable } from '@nestjs/common';
import { GetMeResponseDto } from './dto/get-me.response.dto';

@Injectable()
export class GetMeUseCase {
  async execute(user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
  }): Promise<GetMeResponseDto> {
    return this.convertToResponse(user);
  }

  private convertToResponse(user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
  }): GetMeResponseDto {
    return {
      success: true,
      user,
    };
  }
}
