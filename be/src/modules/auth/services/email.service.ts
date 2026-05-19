import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendRegisterOtp(email: string, otp: string): Promise<void> {
    const transporter = this.createTransporter();
    const from = this.configService.get<string>('SMTP_FROM');

    await transporter.sendMail({
      from,
      to: email,
      subject: 'Mã OTP xác nhận đăng ký',
      text: `Mã OTP của bạn là ${otp}. Mã này hết hạn sau 10 phút.`,
    });
  }

  private createTransporter() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT'));
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const from = this.configService.get<string>('SMTP_FROM');

    if (!host || !Number.isFinite(port) || !user || !pass || !from) {
      throw new InternalServerErrorException(
        'SMTP chưa được cấu hình để gửi OTP',
      );
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  }
}
