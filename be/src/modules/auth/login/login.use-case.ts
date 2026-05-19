import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../../models/user.schema';
import { LoginRequestDto } from './dto/login.request.dto';
import { LoginResponseDto } from './dto/login.response.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.readUser(dto.identifier);
    this.validateUserActive(user);
    await this.validatePassword(dto.password, user.password);
    const accessToken = this.generateToken(user);
    return this.convertToResponse(user, accessToken);
  }

  private async readUser(identifier: string): Promise<UserDocument> {
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const isEmail = normalizedIdentifier.includes('@');
    const user = await this.userModel.findOne({
      [isEmail ? 'email' : 'username']: normalizedIdentifier,
    });
    if (!user) {
      throw new UnauthorizedException(
        'Email/username hoặc mật khẩu không đúng',
      );
    }
    return user;
  }

  private validateUserActive(user: UserDocument): void {
    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }
  }

  private async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const valid = await bcrypt.compare(plainPassword, hashedPassword);
    if (!valid) {
      throw new UnauthorizedException(
        'Email/username hoặc mật khẩu không đúng',
      );
    }
  }

  private generateToken(user: UserDocument): string {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      username: this.resolveUsername(user),
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  private convertToResponse(
    user: UserDocument,
    accessToken: string,
  ): LoginResponseDto {
    return {
      success: true,
      accessToken,
      user: {
        id: user._id.toString(),
        username: this.resolveUsername(user),
        email: user.email,
        fullName: user.fullName || this.resolveUsername(user),
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  private resolveUsername(user: UserDocument): string {
    return user.username || user.email.split('@')[0];
  }
}
