import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import type { RefreshTokenRepository } from '../domain/refresh-token.repository.interface';
import { InvalidRefreshTokenError } from '../domain/errors/invalid-refresh-token.error';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(refreshToken: string): Promise<void> {
    const existing = await this.refreshTokenRepository.findByToken(refreshToken);

    if (!existing || !existing.isValid()) {
      throw new InvalidRefreshTokenError();
    }

    await this.refreshTokenRepository.revokeByToken(refreshToken, new Date());
  }
}
