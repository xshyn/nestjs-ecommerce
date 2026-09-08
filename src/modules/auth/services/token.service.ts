import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { AccessPayload, RefreshPayload } from '../../../types/payload.interface';
import { TokenType } from '../types/token-type.enum';
import { Roles } from '../../users/types/roles.enum';
import { TokenTtl } from '../types/token-ttl.enum';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccess(payload: { userId: string; roles: Roles[] }) {
    const now = Math.floor(Date.now() / 1000);
    const jti = randomUUID();

    const accessPayload: AccessPayload = {
      userId: payload.userId,
      roles: payload.roles,
      type: TokenType.ACCESS,
      jti,
      iat: now,
      exp: now + TokenTtl.ACCESS,
    };

    const token = await this.jwtService.signAsync(accessPayload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET_ACCESS'),
    });

    return {
      token,
      accessPayload,
    };
  }

  async generateRefresh(payload: { userId: string; roles: Roles[] }) {
    const now = Math.floor(Date.now() / 1000);
    const jti = randomUUID();

    const refreshPayload: RefreshPayload = {
      userId: payload.userId,
      roles: payload.roles,
      type: TokenType.REFRESH,
      jti,
      iat: now,
      exp: now + TokenTtl.REFRESH,
    };

    const token = await this.jwtService.signAsync(refreshPayload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET_REFRESH'),
    });

    return {
      token,
      refreshPayload,
    };
  }

  async verifyRefresh(token: string) {
    return this.jwtService.verifyAsync<RefreshPayload>(token, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET_REFRESH'),
    });
  }
}
