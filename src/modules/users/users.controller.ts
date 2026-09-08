import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessJwtAuthGuard } from '../../guards/access-jwt-auth.guard';
import { Payload } from '../../types/payload.interface';
import { Role } from '../../decorators/role.decorator';
import { Roles } from './types/roles.enum';
import { RoleGuard } from '../../guards/role.guard';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { UserQueryDto, userQuerySchema } from './schemas/user-query.schema';
import { ResponseEnvelopeInterceptor } from '../../interceptors/response-envelope.interceptor';
import { User } from './users.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(AccessJwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @ApiBearerAuth()
  @Role(Roles.ADMIN)
  @UseGuards(RoleGuard)
  @UseInterceptors(ResponseEnvelopeInterceptor<User>)
  @Get()
  findAll(@Query(new ZodValidationPipe(userQuerySchema)) query: UserQueryDto) {
    return this.service.find(query);
  }

  @ApiBearerAuth()
  @Get('/me')
  profile(@Request() req: { user: Payload }) {
    return this.service.findOne({ id: req.user.userId });
  }
}
