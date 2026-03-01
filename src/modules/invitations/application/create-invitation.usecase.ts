import { Inject, Injectable } from '@nestjs/common';
import type { InvitationRepository } from '../domain/interfaces/invitation.repository';
import { REPOSITORY_TOKENS, SERVICE_TOKENS } from '../../../common/tokens';
import { Invitation } from '../domain/invitation';
import { OrganizationRoleEnum } from '../../memberships/domain/membership';
import type { EmailService } from '../../email/domain/email.service.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateInvitationUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.InvitationRepository)
    private readonly invitationRepository: InvitationRepository,
    @Inject(SERVICE_TOKENS.EmailService)
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
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

    if (invitedEmail) {
      const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
      const inviteUrl = `${frontendUrl}/accept-invitation?token=${token}`;
      await this.emailService.sendInvitation(invitedEmail, inviteUrl, role);
    }

    return invitation;
  }
}
