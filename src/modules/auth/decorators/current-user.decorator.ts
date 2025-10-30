import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserFromJwt } from '../strategies';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserFromJwt | null => {
    const request = ctx.switchToHttp().getRequest<{ user?: UserFromJwt }>();
    return request.user ?? null;
  },
);
