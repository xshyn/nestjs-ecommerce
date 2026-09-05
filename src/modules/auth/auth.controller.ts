import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/users.entity';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { Payload } from '../../types/payload.interface';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { type SignupDto, signupSchema } from './schemas/signup.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @Post('/user/signup')
  userSignup(@Body(new ZodValidationPipe(signupSchema)) signupDto: SignupDto) {
    return this.service.signup(signupDto);
  }
  @HttpCode(HttpStatus.OK)
  // validation inside guard
  @UseGuards(LocalAuthGuard)
  @Post('/user/login')
  userLogin(@Request() req: { user: Payload }) {
    return this.service.login(req.user);
  }
}
