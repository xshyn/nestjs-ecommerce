import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AccessJwtStrategy } from './strategies/access-jwt.strategy';
import { TokenService } from './services/token.service';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { AccessRefreshJwtStrategy } from './strategies/access-refresh-jwt.strategy';
import { doubleCsrfProtection } from '../csrf/csrf.config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      verifyOptions: {
        complete: true,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AccessJwtStrategy,
    RefreshJwtStrategy,
    AccessRefreshJwtStrategy,
    LocalStrategy,
    TokenService,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(doubleCsrfProtection).forRoutes({
      path: 'auth/refresh',
      method: RequestMethod.POST,
    });
    consumer.apply(doubleCsrfProtection).forRoutes({
      path: 'auth/logout',
      method: RequestMethod.POST,
    });
  }
}
