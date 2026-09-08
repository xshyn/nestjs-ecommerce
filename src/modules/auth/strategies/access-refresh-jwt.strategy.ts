import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AccessPayload } from '../../../types/payload.interface';
import { TokenType } from '../types/token-type.enum';
import { AuthService } from '../auth.service';

@Injectable()
export class AccessRefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'access-refresh-jwt',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET_ACCESS'),
    });
  }
  async validate(payload: AccessPayload) {
    if (payload.type !== TokenType.ACCESS) {
      throw new UnauthorizedException();
    }

    const isRevoked = await this.authService.existsInCache(
      payload.jti,
      'blacklist',
    );

    if (!isRevoked)
      await this.authService.revokeTokenFromBlacklistCache(
        payload.jti,
        payload.exp,
      );

    return payload;
  }
}
