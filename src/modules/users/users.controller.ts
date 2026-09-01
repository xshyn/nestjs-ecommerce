import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Payload } from '../../types/payload.interface';
import { Role } from '../../decorators/role.decorator';
import { Roles } from './types/roles.enum';
import { RoleGuard } from '../../guards/role.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Role(Roles.ADMIN)
  @UseGuards(RoleGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('/me')
  profile(@Request() req: { user: Payload }) {
    return this.service.findBy({ id: req.user.userId });
  }
}
