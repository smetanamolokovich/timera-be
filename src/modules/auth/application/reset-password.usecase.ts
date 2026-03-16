import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS, SERVICE_TOKENS } from '../../../common/tokens';
import type { UserRepository } from '../../users/domain/user.repository';
import type { PasswordResetTokenRepository } from '../domain/password-reset-token.repository.interface';
import type { PasswordHasher } from '../../users/domain/password-hasher';
import { InvalidPasswordResetTokenError } from '../domain/errors/invalid-password-reset-token.error';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(REPOSITORY_TOKENS.PasswordResetTokenRepository)
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    @Inject(SERVICE_TOKENS.PasswordHasher)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(token: string, newPassword: string): Promise<void> {
    const resetToken = await this.passwordResetTokenRepository.findByToken(token);

    if (!resetToken || !resetToken.isValid()) {
      throw new InvalidPasswordResetTokenError();
    }

    const user = await this.userRepository.findById(resetToken.userId);

    if (!user) {
      throw new InvalidPasswordResetTokenError();
    }

    const newPasswordHash = await this.passwordHasher.hash(newPassword);
    user.changePassword(newPasswordHash);
    await this.userRepository.update(user);

    resetToken.markUsed();
    await this.passwordResetTokenRepository.update(resetToken);
  }
}
