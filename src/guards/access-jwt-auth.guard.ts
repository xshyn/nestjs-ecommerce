import { AuthGuard } from '@nestjs/passport';

export class AccessJwtAuthGuard extends AuthGuard('access-jwt') {}
