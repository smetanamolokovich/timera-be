import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../domain/email.service.interface';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodemailerEmailService implements EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly configService: ConfigService) {}

  private getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: this.configService.getOrThrow<string>('SMTP_HOST'),
        port: Number(this.configService.getOrThrow<string>('SMTP_PORT')),
        secure: this.configService.get('SMTP_SECURE') === 'true',
        auth: {
          user: this.configService.getOrThrow<string>('SMTP_USER'),
          pass: this.configService.getOrThrow<string>('SMTP_PASS'),
        },
      });
    }
    return this.transporter;
  }

  async sendInvitation(
    to: string,
    inviteUrl: string,
    role: string,
  ): Promise<void> {
    const from = this.configService.getOrThrow<string>('MAIL_FROM');
    const subject = 'You are invited to join Timera';
    const text = `You have been invited to join Timera as a ${role}. Click the link below to accept the invitation:\n\n${inviteUrl}`;
    const html = `<p>You have been invited to join Timera as a <strong>${role}</strong>.</p><p>Click the link below to accept the invitation:</p><p><a href="${inviteUrl}">${inviteUrl}</a></p>`;

    await this.getTransporter().sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
  }

  async sendPasswordReset(to: string, resetUrl: string): Promise<void> {
    const from = this.configService.getOrThrow<string>('MAIL_FROM');
    const subject = 'Reset your Timera password';
    const text = `You requested a password reset. Click the link below to set a new password:\n\n${resetUrl}\n\nThis link expires in 1 hour. If you did not request this, please ignore this email.`;
    const html = `<p>You requested a password reset.</p><p>Click the link below to set a new password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 1 hour. If you did not request this, please ignore this email.</p>`;

    await this.getTransporter().sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
  }
}
