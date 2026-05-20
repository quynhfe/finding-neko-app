import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DeleteCatProfileUseCase } from './delete-cat.use-case';
import { DeleteCatProfileResponseDto } from './dto/delete-cat.response.dto';

interface RequestUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

@Controller('cats')
export class DeleteCatProfileController {
  constructor(private readonly deleteCatProfileUseCase: DeleteCatProfileUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCatProfile(
    @Param('id') catId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<DeleteCatProfileResponseDto> {
    return this.deleteCatProfileUseCase.execute(catId, user);
  }
}
