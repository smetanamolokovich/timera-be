import { Organization } from '../domain/organization';
import { OrganizationOrmEntity } from './organization.orm-entity';

export class OrganizationMapper {
  static fromDomain(domain: Organization): OrganizationOrmEntity {
    const orm = new OrganizationOrmEntity();
    orm.id = domain.id;
    orm.name = domain.name;
    orm.ownerId = domain.ownerId;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    orm.address = domain.address ?? null;
    orm.phoneNumber = domain.phoneNumber ?? null;
    orm.email = domain.email ?? null;
    orm.logoUrl = domain.logoUrl ?? null;
    orm.isActive = domain.isActive;

    return orm;
  }

  static toDomain(raw: OrganizationOrmEntity): Organization {
    return new Organization(
      raw.id,
      raw.name,
      raw.ownerId,
      raw.updatedAt,
      raw.createdAt,
      raw.address ?? undefined,
      raw.phoneNumber ?? undefined,
      raw.email ?? undefined,
      raw.logoUrl ?? undefined,
      raw.isActive,
    );
  }

  static toOrm(domain: Organization): OrganizationOrmEntity {
    const orm = new OrganizationOrmEntity();
    orm.id = domain.id;
    orm.name = domain.name;
    orm.ownerId = domain.ownerId;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    orm.address = domain.address ?? null;
    orm.phoneNumber = domain.phoneNumber ?? null;
    orm.email = domain.email ?? null;
    orm.logoUrl = domain.logoUrl ?? null;
    orm.isActive = domain.isActive;

    return orm;
  }
}
