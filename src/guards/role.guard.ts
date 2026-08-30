import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, ROLES_KEY } from '../decorators/role.decorator';
import { Roles } from '../modules/users/types/roles.enum';
import { Payload } from '../types/payload.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(ctx: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!requiredRoles) return true;
    const { user }: { user: Payload } = ctx.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
