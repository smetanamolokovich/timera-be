import { Invitation } from '../domain/invitation';

export class InvitationPresentationMapper {
  static toResponse(invitation: Invitation) {
    return {
      id: invitation.id,
      organizationId: invitation.organizationId,
      role: invitation.role,
      token: invitation.token,
      expiresAt: invitation.expiresAt,
      invitedEmail: invitation.invitedEmail,
      inviteUrl: `${process.env.APP_URL}/invitations/accept?token=${invitation.token}`,
    };
  }

  static toResponseWithoutToken(invitation: Invitation) {
    return {
      id: invitation.id,
      organizationId: invitation.organizationId,
      role: invitation.role,
      expiresAt: invitation.expiresAt,
      invitedEmail: invitation.invitedEmail,
    };
  }
}
