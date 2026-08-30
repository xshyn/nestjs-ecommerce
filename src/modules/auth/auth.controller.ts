import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/users.entity';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { Payload } from '../../types/payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @Post('/user/signup')
  userSignup(@Body() data: User) {
    return this.service.signup(data);
  }
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('/user/login')
  userLogin(@Request() req: { user: Payload }) {
    return this.service.login(req.user);
  }
}
