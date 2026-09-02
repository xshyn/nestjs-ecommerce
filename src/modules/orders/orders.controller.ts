import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Role } from '../../decorators/role.decorator';
import { Roles } from '../users/types/roles.enum';
import { RoleGuard } from '../../guards/role.guard';
import { Payload } from '../../types/payload.interface';
import { OrderStatus } from './orders.type';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get()
  findUserOrders(@Request() { user }: { user: Payload }) {
    return this.service.findAll({ where: { userId: user.userId } });
  }

  @Role(Roles.ADMIN)
  @UseGuards(RoleGuard)
  @Get('list')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(
    @Request() { user }: { user: Payload },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.findOne({
      where: { userId: user.userId, id },
      relations: { items: true },
    });
  }

  @Post('checkout')
  checkout(@Request() { user }: { user: Payload }) {
    return this.service.checkout(user.userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Request() { user }: { user: Payload },
    @Body() { status }: { status: OrderStatus },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.updateStatus(id, user.userId, status, true);
  }
}
