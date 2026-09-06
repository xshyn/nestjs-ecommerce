import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
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
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import {
  type OrdersListQueryDto,
  ordersListQuerySchema,
} from './schemas/orders-list-query.schema';
import {
  type UserOrdersListQueryDto,
  userOrderslistQuerySchema,
} from './schemas/user-orders-list-query.schema';
import {
  type UpdateOrderStatusDto,
  updateOrderStatusSchema,
} from './schemas/update-order-status.schema';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get()
  findUserOrders(
    @Request() { user }: { user: Payload },
    @Query(new ZodValidationPipe(userOrderslistQuerySchema))
    query: UserOrdersListQueryDto,
  ) {
    return this.service.findAll({ userId: user.userId, ...query });
  }

  @Role(Roles.ADMIN)
  @UseGuards(RoleGuard)
  @Get('list')
  findAll(
    @Query(new ZodValidationPipe(ordersListQuerySchema))
    ordersListQueryDto: OrdersListQueryDto,
  ) {
    return this.service.findAll(ordersListQueryDto);
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
    @Body(new ZodValidationPipe(updateOrderStatusSchema))
    { status }: UpdateOrderStatusDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.updateStatus(id, user.userId, status, true);
  }
}
