import {
  Injectable,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { User, UserDocument } from '../../../models/user.schema';
import {
  PendingRegistration,
  PendingRegistrationDocument,
} from '../../../models/pending-registration.schema';
import { RegisterRequestDto } from './dto/register.request.dto';
import {
  RegisterStartResponseDto,
  VerifyRegisterOtpResponseDto,
} from './dto/register.response.dto';
import { VerifyRegisterOtpRequestDto } from './dto/verify-register-otp.request.dto';
import { EmailService } from '../services/email.service';

const SALT_ROUNDS = 10;
const OTP_TTL_MS = 10 * 60 * 1000;

@Injectable()
export class RegisterUseCase {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(PendingRegistration.name)
    private readonly pendingRegistrationModel: Model<PendingRegistrationDocument>,
    private readonly emailService: EmailService,
  ) {}

  async execute(dto: RegisterRequestDto): Promise<RegisterStartResponseDto> {
    const username = this.normalizeUsername(dto.username);
    const email = this.normalizeEmail(dto.email);

    await this.validateUnique(username, email);
    const hashedPassword = await this.hashPassword(dto.password);
    const otp = this.generateOtp();
    const otpHash = await this.hashPassword(otp);

    await this.pendingRegistrationModel.deleteMany({
      $or: [{ username }, { email }],
    });

    await this.pendingRegistrationModel.create({
      username,
      email,
      password: hashedPassword,
      otpHash,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    });

    try {
      await this.emailService.sendRegisterOtp(email, otp);
    } catch {
      await this.pendingRegistrationModel.deleteOne({ email });
      throw new InternalServerErrorException(
        'Không gửi được OTP, vui lòng kiểm tra email hoặc thử lại',
      );
    }

    return {
      success: true,
      email,
      message: 'OTP đã được gửi tới email đăng ký',
    };
  }

  async verifyOtp(
    dto: VerifyRegisterOtpRequestDto,
  ): Promise<VerifyRegisterOtpResponseDto> {
    const username = this.normalizeUsername(dto.username);
    const email = this.normalizeEmail(dto.email);
    const pending = await this.pendingRegistrationModel.findOne({ email });

    try {
      if (!pending || pending.expiresAt.getTime() < Date.now()) {
        throw new BadRequestException('OTP không hợp lệ hoặc đã hết hạn');
      }

      if (pending.username !== username) {
        throw new BadRequestException('Thông tin đăng ký không khớp');
      }

      const validPassword = await bcrypt.compare(dto.password, pending.password);
      if (!validPassword) {
        throw new BadRequestException('Thông tin đăng ký không khớp');
      }

      const validOtp = await bcrypt.compare(dto.otp, pending.otpHash);
      if (!validOtp) {
        throw new BadRequestException('OTP không hợp lệ hoặc đã hết hạn');
      }

      await this.validateUnique(pending.username, pending.email);
      await this.createUser(pending.username, pending.email, pending.password);

      return {
        success: true,
        message: 'Xác minh OTP thành công. Vui lòng đăng nhập.',
      };
    } finally {
      await this.pendingRegistrationModel.deleteOne({ email });
    }
  }

  private async validateUnique(username: string, email: string): Promise<void> {
    const existing = await this.userModel
      .findOne({
        $or: [{ username }, { email }],
      })
      .lean();
    if (existing) {
      if (existing.username === username) {
        throw new ConflictException('Username đã được sử dụng');
      }
      throw new ConflictException('Email đã được sử dụng');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  private async createUser(
    username: string,
    email: string,
    hashedPassword: string,
  ): Promise<UserDocument> {
    return this.userModel.create({
      username,
      email,
      password: hashedPassword,
      fullName: username,
    });
  }

  private generateOtp(): string {
    return randomInt(100000, 1000000).toString();
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private normalizeUsername(username: string): string {
    return username.trim().toLowerCase();
  }
}
