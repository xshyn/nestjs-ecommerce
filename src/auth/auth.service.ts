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

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}
  async login(data: User) {
    const user = await this.userService.findBy({ email: data.email });
    if (!user) throw new NotFoundException();
    const isPassCorrect = this.comparePass(data.password, user.password);
    if (!isPassCorrect) throw new UnauthorizedException();
    return { success: true };
  }
  async signup(data: User) {
    return this.userService.create({
      email: data.email,
      password: this.hashPass(data.password),
    });
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
