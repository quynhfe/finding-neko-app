import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConfig } from '../../config/jwt.config';
import { User, UserSchema } from '../../models/user.schema';
import {
  PendingRegistration,
  PendingRegistrationSchema,
} from '../../models/pending-registration.schema';
import { RegisterController } from './register/register.controller';
import { RegisterUseCase } from './register/register.use-case';
import { LoginController } from './login/login.controller';
import { LoginUseCase } from './login/login.use-case';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailService } from './services/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {
        name: PendingRegistration.name,
        schema: PendingRegistrationSchema,
      },
    ]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),
  ],
  controllers: [RegisterController, LoginController],
  providers: [RegisterUseCase, LoginUseCase, JwtStrategy, EmailService],
  exports: [JwtStrategy, PassportModule, JwtModule, MongooseModule],
})
export class AuthModule {}
