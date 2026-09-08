import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { loginSchema } from '../modules/auth/schemas/login.schema';

export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    // body validation
    try {
      loginSchema.parse(req.body);
    } catch (error) {
      throw new BadRequestException('Validation failed');
    }
    return super.canActivate(ctx) as Promise<boolean>;
  }
}
