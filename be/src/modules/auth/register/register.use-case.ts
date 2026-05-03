import {
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../../models/user.schema';
import { RegisterRequestDto } from './dto/register.request.dto';
import { RegisterResponseDto } from './dto/register.response.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class RegisterUseCase {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: RegisterRequestDto): Promise<RegisterResponseDto> {
    await this.validateEmailUnique(dto.email);
    const hashedPassword = await this.hashPassword(dto.password);
    const user = await this.createUser(dto, hashedPassword);
    const accessToken = this.generateToken(user);
    return this.convertToResponse(user, accessToken);
  }

  private async validateEmailUnique(email: string): Promise<void> {
    const existing = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .lean();
    if (existing) {
      throw new ConflictException('Email đã được sử dụng');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  private async createUser(
    dto: RegisterRequestDto,
    hashedPassword: string,
  ): Promise<UserDocument> {
    return this.userModel.create({
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      fullName: dto.fullName,
    });
  }

  private generateToken(user: UserDocument): string {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  private convertToResponse(
    user: UserDocument,
    accessToken: string,
  ): RegisterResponseDto {
    return {
      success: true,
      accessToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
