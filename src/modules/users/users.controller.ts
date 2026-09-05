import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Payload } from '../../types/payload.interface';
import { Role } from '../../decorators/role.decorator';
import { Roles } from './types/roles.enum';
import { RoleGuard } from '../../guards/role.guard';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import {
  type UserQueryDto,
  userQuerySchema,
} from './schemas/user-query.schema';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Role(Roles.ADMIN)
  @UseGuards(RoleGuard)
  @Get()
  findAll(@Query(new ZodValidationPipe(userQuerySchema)) query: UserQueryDto) {
    return this.service.find(query);
  }

  @Get('/me')
  profile(@Request() req: { user: Payload }) {
    return this.service.findOne({ id: req.user.userId });
  }
}
