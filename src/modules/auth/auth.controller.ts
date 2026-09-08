import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import {
  AccessPayload,
  Payload,
  RefreshPayload,
} from '../../types/payload.interface';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { SignupDto, signupSchema } from './schemas/signup.schema';
import { type Request, type Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenTtl } from './types/token-ttl.enum';
import { RefreshJwtAuthGuard } from '../../guards/refresh-jwt-auth.guard';
import { LocalPayload } from './types/local-payload.interface';
import { AccessJwtAuthGuard } from '../../guards/access-jwt-auth.guard';
import { AccessRefreshJwtAuthGuard } from '../../guards/access-refresh-jwt-auth.guard';
import { generateCsrfToken } from '../csrf/csrf.config';
import { ApiBody } from '@nestjs/swagger';
import { LoginDto } from './schemas/login.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly configService: ConfigService,
  ) {}
  @Post('signup')
  userSignup(@Body(new ZodValidationPipe(signupSchema)) signupDto: SignupDto) {
    return this.service.signup(signupDto);
  }
  @HttpCode(HttpStatus.OK)
  // validation inside guard
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @Post('login')
  async userLogin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.service.login(req.user as LocalPayload);

    res.cookie('refresh', tokens.refresh, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: TokenTtl.REFRESH * 1000,
    });

    return { access: tokens.access };
  }

  @UseGuards(AccessRefreshJwtAuthGuard, RefreshJwtAuthGuard)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const payload = req.user as RefreshPayload;

    const tokens = await this.service.refresh(payload);

    res.cookie('refresh', tokens.refresh.token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: TokenTtl.REFRESH * 1000,
    });

    return { access: tokens.access.token };
  }

  @UseGuards(AccessJwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const accessPayload = req.user as AccessPayload;

    await this.service.logout(accessPayload, req.cookies.refresh);

    res.clearCookie('refresh');

    return {
      message: 'Logged out successfully',
    };
  }

  @Get('csrf-token')
  csrfToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return generateCsrfToken(req, res, { overwrite: true });
  }
}
