import { Invitation } from '../domain/invitation';
import { InvitationOrmEntity } from './invitation.orm-entity';

export class InvitationMapper {
  static toDomain(raw: InvitationOrmEntity): Invitation {
    return new Invitation(
      raw.id,
      raw.organizationId,
      raw.role,
      raw.token,
      raw.expiresAt,
      raw.createdByUserId,
      raw.createdAt,
      raw.invitedEmail ?? undefined,
      raw.usedAt ?? undefined,
    );
  }

  static toOrm(invitation: Invitation): InvitationOrmEntity {
    const ormEntity = new InvitationOrmEntity();
    ormEntity.id = invitation.id;
    ormEntity.organizationId = invitation.organizationId;
    ormEntity.role = invitation.role;
    ormEntity.token = invitation.token;
    ormEntity.createdByUserId = invitation.createdByUserId;
    ormEntity.createdAt = invitation.createdAt;
    ormEntity.expiresAt = invitation.expiresAt;
    ormEntity.invitedEmail = invitation.invitedEmail ?? null;
    ormEntity.usedAt = invitation.usedAt ?? null;

    return ormEntity;
  }
}
