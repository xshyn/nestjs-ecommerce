import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AccessJwtStrategy } from './strategies/access-jwt.strategy';
import { TokenService } from './token.service';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { AccessRefreshJwtStrategy } from './strategies/access-refresh-jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // TODO change this later
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
export class AuthModule {}
