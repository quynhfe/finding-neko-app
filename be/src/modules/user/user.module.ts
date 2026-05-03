import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GetMeController } from './get-me/get-me.controller';
import { GetMeUseCase } from './get-me/get-me.use-case';

@Module({
  imports: [AuthModule],
  controllers: [GetMeController],
  providers: [GetMeUseCase],
})
export class UserModule {}
