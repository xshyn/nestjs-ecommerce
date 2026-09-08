import { AuthGuard } from '@nestjs/passport';

export class AccessRefreshJwtAuthGuard extends AuthGuard(
  'access-refresh-jwt',
) {}
