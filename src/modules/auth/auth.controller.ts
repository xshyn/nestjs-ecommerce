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
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AccessPayload, RefreshPayload } from '../../types/payload.interface';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { SignupDto, signupSchema } from './schemas/signup.schema';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenTtl } from './types/token-ttl.enum';
import { RefreshJwtAuthGuard } from '../../guards/refresh-jwt-auth.guard';
import { LocalPayload } from './types/local-payload.interface';
import { AccessJwtAuthGuard } from '../../guards/access-jwt-auth.guard';
import { AccessRefreshJwtAuthGuard } from '../../guards/access-refresh-jwt-auth.guard';
import { generateCsrfToken } from '../csrf/csrf.config';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './schemas/login.schema';
import { ValidationFailedResponse } from '../../responses/validation-failed.response';
import { UserResponse } from '../users/responses/user.response';
import { AccessResponse } from './responses/access.response';
import { UnauthorizedResponse } from '../../responses/unauthorized.response';
import { CsrfExceptionResponse } from '../../responses/csrf-exception.response';
import { LogoutResponse } from './responses/logout.response';
import { CsrfResponse } from './responses/csrf.response';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly configService: ConfigService,
  ) {}
  @ApiOperation({
    summary: 'Signup user',
  })
  @ApiBadRequestResponse({ type: ValidationFailedResponse })
  @ApiCreatedResponse({ type: UserResponse })
  // TODO there is another type of error which is related to typeorm uniqueness
  @Post('signup')
  userSignup(@Body(new ZodValidationPipe(signupSchema)) signupDto: SignupDto) {
    return this.service.signup(signupDto);
  }

  @ApiOperation({
    summary: 'Login user',
  })
  @ApiBadRequestResponse({ type: ValidationFailedResponse })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse })
  @ApiOkResponse({ type: AccessResponse })
  @ApiBody({ type: LoginDto })
  @HttpCode(HttpStatus.OK)
  // validation inside guard
  @UseGuards(LocalAuthGuard)
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

  @ApiOperation({
    summary: 'Refresh user access',
  })
  @ApiHeader({ name: 'x-csrf-token' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse })
  @ApiForbiddenResponse({ type: CsrfExceptionResponse })
  @ApiCreatedResponse({ type: AccessResponse })
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

  @ApiOperation({
    summary: 'Logout user',
  })
  @ApiHeader({ name: 'x-csrf-token' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse })
  @ApiForbiddenResponse({ type: CsrfExceptionResponse })
  @ApiOkResponse({ type: LogoutResponse })
  @HttpCode(HttpStatus.OK)
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

  @ApiOperation({ summary: 'Get CSRF token' })
  @ApiOkResponse({ type: CsrfResponse })
  @Get('csrf-token')
  csrfToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const csrf = generateCsrfToken(req, res);

    return { csrf };
  }
}
