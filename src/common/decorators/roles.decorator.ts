import { SetMetadata } from '@nestjs/common';
import { OrganizationRoleEnum } from '../../modules/memberships/domain/membership';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: OrganizationRoleEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
