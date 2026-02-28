import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OrganizationRoleEnum } from '../../modules/memberships/domain/membership';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtUser } from '../decorators/current-user.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<OrganizationRoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!roles) return true;

    const { user } = context.switchToHttp().getRequest<{ user: JwtUser }>();

    if (!user?.role) {
      throw new ForbiddenException(
        'You must be a member of an organization to perform this action',
      );
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenException(
        `Required role: ${roles.join(' or ')}. Your role: ${user.role}`,
      );
    }

    return true;
  }
}
