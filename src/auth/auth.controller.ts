import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/users.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @Post('/user/signup')
  userSignup(@Body() data: User) {
    return this.service.signup(data);
  }
  @Post('/user/login')
  userLogin(@Body() data: User) {
    return this.service.login(data);
  }
}
