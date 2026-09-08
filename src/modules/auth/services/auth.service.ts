import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';
import { AccessPayload, RefreshPayload } from '../../../types/payload.interface';
import { SignupDto } from '../schemas/signup.schema';
import { CacheService } from '../../cache/cache.service';
import { CacheKeys } from '../../cache/cache.keys';
import { Roles } from '../../users/types/roles.enum';
import { TokenService } from '../services/token.service';
import { LocalPayload } from '../types/local-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly cache: CacheService,
    private readonly tokenService: TokenService,
  ) {}
  async login(user: LocalPayload) {
    const access = await this.tokenService.generateAccess(user);
    const refresh = await this.tokenService.generateRefresh(user);

    await this.createRefreshCache(
      refresh.refreshPayload.jti,
      user,
      refresh.refreshPayload.exp,
    );

    return { access: access.token, refresh: refresh.token };
  }
  async signup(signupDto: SignupDto) {
    return this.userService.create({
      email: signupDto.email,
      password: this.hashPass(signupDto.password),
    });
  }
  async refresh(payload: RefreshPayload) {
    await this.revokeTokenFromRefreshCache(payload.jti);

    const access = await this.tokenService.generateAccess({
      userId: payload.userId,
      roles: payload.roles,
    });
    const refresh = await this.tokenService.generateRefresh({
      userId: payload.userId,
      roles: payload.roles,
    });

    await this.createRefreshCache(
      payload.jti,
      {
        userId: payload.userId,
        roles: payload.roles,
      },
      payload.exp,
    );

    return {
      access,
      refresh
    };
  }
  async logout(accessPayload: AccessPayload, refresh: string) {
    await this.revokeTokenFromBlacklistCache(
      accessPayload.jti,
      accessPayload.exp,
    );

    try {
      const refreshPayload = await this.tokenService.verifyRefresh(refresh);
      await this.revokeTokenFromRefreshCache(refreshPayload.jti);
    } catch {}
  }
  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne({ email: email }, true);
    if (!user || !this.comparePass(password, user?.password)) return null;
    return user;
  }
  private hashPass(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);
    return hashed;
  }
  private comparePass(password: string, hashedPass: string) {
    return bcrypt.compareSync(password, hashedPass);
  }

  async revokeTokenFromBlacklistCache(jti: string, exp: number) {
    const ttl = this.extractTtl(exp);
    if (ttl <= 0) return;

    await this.cache.set(CacheKeys.blacklist(jti), '1', ttl);
  }

  async revokeTokenFromRefreshCache(jti: string) {
    await this.cache.delete(CacheKeys.refresh(jti));
  }

  async createRefreshCache(
    jti: string,
    payload: { userId: string; roles: Roles[] },
    exp: number,
  ) {
    const ttl = this.extractTtl(exp);

    await this.cache.set(
      CacheKeys.refresh(jti),
      {
        userId: payload.userId,
        roles: payload.roles,
        jti,
      },
      ttl,
    );
  }

  existsInCache(jti: string, type: 'refresh' | 'blacklist') {
    return this.cache.exists(
      type === 'blacklist' ? CacheKeys.blacklist(jti) : CacheKeys.refresh(jti),
    );
  }

  private extractTtl(exp: number) {
    const now = Math.floor(Date.now() / 1000);
    return exp - now;
  }
}
