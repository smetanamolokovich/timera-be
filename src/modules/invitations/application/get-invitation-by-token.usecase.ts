import { Inject, Injectable } from '@nestjs/common';
import type { InvitationRepository } from '../domain/interfaces/invitation.repository';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import { InvalidInvitationTokenError } from '../domain/errors/invalid-invitation-token.error';

@Injectable()
export class GetInvitationByTokenUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.InvitationRepository)
    private readonly invitationRepository: InvitationRepository,
  ) {}

  async execute(token: string) {
    const invitation = await this.invitationRepository.findByToken(token);

    if (!invitation) throw new InvalidInvitationTokenError();

    return invitation;
  }
}
