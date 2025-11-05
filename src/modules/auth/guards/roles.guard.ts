import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { $Enums } from '@prisma/client';
import { ROLES_KEY } from '../decorators';
import type { UserRole } from 'src/modules/user/enums/user-role.enum';
import type { UserFromJwt } from '../strategies';
import { COMMON_MESSAGES } from 'src/common/constants/common-messages.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: UserFromJwt }>();

    if (!user?.role) {
      throw new ForbiddenException(COMMON_MESSAGES.USER_ROLE_REQUIRED);
    }

    if (user.role === $Enums.UserRole.SUPER_ADMIN) {
      return true;
    }

    if (requiredRoles.includes(user.role)) {
      return true;
    }

    throw new ForbiddenException(COMMON_MESSAGES.PERMISSION_DENIED);
  }
}
