import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { RefreshPayload } from '../../../types/payload.interface';
import { TokenType } from '../types/token-type.enum';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      // TODO: must implement token extraction
      jwtFromRequest: (req: Request) => {
        return req.cookies?.refresh ?? null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT-SECRET-REFRESH'),
    });
  }
  async validate(payload: RefreshPayload) {
    if (payload.type !== TokenType.REFRESH) {
      throw new UnauthorizedException();
    }

    const exists = await this.authService.exists(payload.jti, 'refresh');
    if (!exists) throw new UnauthorizedException();

    return payload;
  }
}
