import { Membership } from '../domain/membership';
import { MembershipOrmEntity } from './membership.orm-entity';

export class MembershipMapper {
  static toDomain(orm: MembershipOrmEntity): Membership {
    return new Membership(
      orm.id,
      orm.userId,
      orm.organizationId,
      orm.role,
      orm.createdAt,
    );
  }

  static fromDomain(domain: Membership): MembershipOrmEntity {
    const orm = new MembershipOrmEntity();
    orm.id = domain.id;
    orm.userId = domain.userId;
    orm.organizationId = domain.organizationId;
    orm.role = domain.role;
    orm.createdAt = domain.createdAt;
    return orm;
  }
}
