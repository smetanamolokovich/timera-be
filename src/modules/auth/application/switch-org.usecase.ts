import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import type { MembershipRepository } from '../../memberships/domain/interfaces/membership.repository.interface';
import { AccessDeniedError } from '../../../common/errors/access-denied.error';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SwitchOrgUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.MembershipRepository)
    private readonly membershipRepository: MembershipRepository,
    private jwtService: JwtService,
  ) {}

  async execute(userId: string, email: string, organizationId: string) {
    const membership =
      await this.membershipRepository.findByUserAndOrganization(
        userId,
        organizationId,
      );
    if (!membership) throw new AccessDeniedError();

    const payload = {
      sub: userId,
      email: email,
      organizationId: membership.organizationId,
      role: membership.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
