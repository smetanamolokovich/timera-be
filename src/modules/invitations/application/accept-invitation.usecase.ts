import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import type { InvitationRepository } from '../domain/interfaces/invitation.repository';
import type { MembershipRepository } from '../../memberships/domain/interfaces/membership.repository.interface';
import { Membership } from '../../memberships/domain/membership';
import { InvalidInvitationTokenError } from '../domain/errors/invalid-invitation-token.error';

@Injectable()
export class AcceptInvitationUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.InvitationRepository)
    private readonly invitationRepository: InvitationRepository,
    @Inject(REPOSITORY_TOKENS.MembershipRepository)
    private readonly membershipRepository: MembershipRepository,
  ) {}

  async execute(userId: string, token: string) {
    const invitation = await this.invitationRepository.findByToken(token);

    if (!invitation) {
      throw new InvalidInvitationTokenError();
    }

    if (invitation.isExpired()) {
      throw new InvalidInvitationTokenError();
    }

    if (invitation.isUsed()) {
      throw new InvalidInvitationTokenError();
    }

    const membership = new Membership(
      crypto.randomUUID(),
      userId,
      invitation.organizationId,
      invitation.role,
      new Date(),
    );

    await this.membershipRepository.save(membership);
    await this.invitationRepository.markAsUsed(invitation.id, new Date());
  }
}
