import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Payload } from '../../types/payload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('/')
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  profile(@Request() req: { user: Payload }) {
    return this.service.findBy({ id: req.user.userId });
  }
}
