import { Inject, Injectable } from '@nestjs/common';
import type { InvitationRepository } from '../domain/interfaces/invitation.repository';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import { Invitation } from '../domain/invitation';
import { OrganizationRoleEnum } from '../../memberships/domain/membership';

@Injectable()
export class CreateInvitationUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.InvitationRepository)
    private readonly invitationRepository: InvitationRepository,
  ) {}

  async execute(
    organizationId: string,
    createdByUserId: string,
    role: OrganizationRoleEnum,
    invitedEmail?: string,
    expiresInDays: number = 7,
  ) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const createdAt = new Date();

    const token = crypto.randomUUID();

    const invitation = new Invitation(
      crypto.randomUUID(),
      organizationId,
      role,
      token,
      expiresAt,
      createdByUserId,
      createdAt,
      invitedEmail,
    );

    await this.invitationRepository.save(invitation);

    return invitation;
  }
}
