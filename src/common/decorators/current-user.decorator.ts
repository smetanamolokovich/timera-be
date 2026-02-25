import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { OrganizationRole } from '../../modules/memberships/domain/membership';

export interface JwtUser {
  id: string;
  email: string;
  organizationId: string | null;
  role: OrganizationRole | null;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtUser }>();
    return request.user;
  },
);
