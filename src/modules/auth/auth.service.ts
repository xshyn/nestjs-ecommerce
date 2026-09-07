import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/users.entity';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../../types/payload.interface';
import { SignupDto } from './schemas/signup.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async login(user: Payload) {
    const payload: Payload = {
      email: user.email,
      userId: user.userId,
      roles: user.roles,
    };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
  async signup(signupDto: SignupDto) {
    return this.userService.create({
      email: signupDto.email,
      password: this.hashPass(signupDto.password),
    });
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
}
