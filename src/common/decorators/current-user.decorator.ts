import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtUser {
  id: string;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtUser }>();
    return request.user;
  },
);
