import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes, randomUUID } from 'crypto';
import { REPOSITORY_TOKENS, SERVICE_TOKENS } from '../../../common/tokens';
import type { UserRepository } from '../../users/domain/user.repository';
import type { PasswordResetTokenRepository } from '../domain/password-reset-token.repository.interface';
import type { EmailService } from '../../email/domain/email.service.interface';
import { PasswordResetToken } from '../domain/password-reset-token';

@Injectable()
export class ForgotPasswordUseCase {
  private readonly logger = new Logger(ForgotPasswordUseCase.name);

  constructor(
    @Inject(REPOSITORY_TOKENS.UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(REPOSITORY_TOKENS.PasswordResetTokenRepository)
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    @Inject(SERVICE_TOKENS.EmailService)
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    // Always return successfully to prevent user enumeration
    if (!user) {
      return;
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const token = new PasswordResetToken(
      randomUUID(),
      user.id,
      randomBytes(32).toString('hex'),
      expiresAt,
      new Date(),
    );

    await this.passwordResetTokenRepository.save(token);

    try {
      const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
      const resetUrl = `${frontendUrl}/reset-password?token=${token.token}`;
      await this.emailService.sendPasswordReset(user.email, resetUrl);
    } catch (err) {
      // Email delivery is best-effort: the token is already persisted.
      this.logger.error(
        `Failed to send password reset email to ${user.email}`,
        err,
      );
    }
  }
}
