import { Inject } from '@nestjs/common';
import type { UserRepository } from '../../users/domain/user.repository';
import { JwtService } from '@nestjs/jwt';
import { InvalidEmailOrPasswordError } from '../domain/errors/invalid-email-or-password.error';
import type { PasswordHasher } from '../../users/domain/password-hasher';
import { REPOSITORY_TOKENS, SERVICE_TOKENS } from '../../../common/tokens';
import type { MembershipRepository } from '../../memberships/domain/interfaces/membership.repository.interface';
import type { RefreshTokenRepository } from '../domain/refresh-token.repository.interface';
import { randomBytes, randomUUID } from 'crypto';
import { RefreshToken } from '../domain/refresh-token';

export class LoginUserUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.UserRepository)
    private userRepository: UserRepository,
    @Inject(SERVICE_TOKENS.PasswordHasher)
    private passwordHasher: PasswordHasher,
    @Inject(REPOSITORY_TOKENS.MembershipRepository)
    private membershipRepository: MembershipRepository,
    @Inject(REPOSITORY_TOKENS.RefreshTokenRepository)
    private refreshTokenRepository: RefreshTokenRepository,
    private jwtService: JwtService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidEmailOrPasswordError();
    }

    const isMatch = await this.passwordHasher.compare(
      password,
      user.getPasswordHash(),
    );

    if (!isMatch) {
      throw new InvalidEmailOrPasswordError();
    }

    const memberships = await this.membershipRepository.findByUserId(user.id);
    const activeMembership = memberships[0] ?? null;

    const payload = {
      sub: user.id,
      email: user.email,
      organizationId: activeMembership?.organizationId ?? null,
      role: activeMembership?.role ?? null,
    };

    const refreshTokenValue = randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const refreshToken = new RefreshToken(
      randomUUID(),
      user.id,
      refreshTokenValue,
      expiresAt,
      new Date(),
      null,
    );

    await this.refreshTokenRepository.save(refreshToken);

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: refreshTokenValue,
    };
  }
}
