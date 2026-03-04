import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, randomUUID } from 'crypto';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import type { UserRepository } from '../../users/domain/user.repository';
import type { MembershipRepository } from '../../memberships/domain/interfaces/membership.repository.interface';
import type { RefreshTokenRepository } from '../domain/refresh-token.repository.interface';
import { RefreshToken } from '../domain/refresh-token';
import { InvalidRefreshTokenError } from '../domain/errors/invalid-refresh-token.error';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(REPOSITORY_TOKENS.MembershipRepository)
    private readonly membershipRepository: MembershipRepository,
    @Inject(REPOSITORY_TOKENS.RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(token: string) {
    const existing = await this.refreshTokenRepository.findByToken(token);

    if (!existing || !existing.isValid()) {
      throw new InvalidRefreshTokenError();
    }

    await this.refreshTokenRepository.revokeByToken(token, new Date());

    const user = await this.userRepository.findById(existing.userId);

    if (!user) {
      throw new InvalidRefreshTokenError();
    }

    const memberships = await this.membershipRepository.findByUserId(user.id);
    const activeMembership = memberships[0] ?? null;

    const payload = {
      sub: user.id,
      email: user.email,
      organizationId: activeMembership?.organizationId ?? null,
      role: activeMembership?.role ?? null,
    };

    const newRefreshTokenValue = randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const newRefreshToken = new RefreshToken(
      randomUUID(),
      user.id,
      newRefreshTokenValue,
      expiresAt,
      new Date(),
      null,
    );

    await this.refreshTokenRepository.save(newRefreshToken);

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: newRefreshTokenValue,
    };
  }
}
