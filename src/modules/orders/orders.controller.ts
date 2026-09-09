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
  UseInterceptors,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AccessJwtAuthGuard } from '../../guards/access-jwt-auth.guard';
import { Role } from '../../decorators/role.decorator';
import { Roles } from '../users/types/roles.enum';
import { RoleGuard } from '../../guards/role.guard';
import { Payload } from '../../types/payload.interface';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import {
  OrdersListQueryDto,
  ordersListQuerySchema,
} from './schemas/orders-list-query.schema';
import {
  UserOrdersListQueryDto,
  userOrderslistQuerySchema,
} from './schemas/user-orders-list-query.schema';
import {
  UpdateOrderStatusDto,
  updateOrderStatusSchema,
} from './schemas/update-order-status.schema';
import { ResponseEnvelopeInterceptor } from '../../interceptors/response-envelope.interceptor';
import { Order } from './orders.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UnauthorizedResponse } from '../../responses/unauthorized.response';
import { ValidationFailedResponse } from '../../responses/validation-failed.response';
import { OrderListResponse } from './responses/order-list.response';
import { ForbiddenResponse } from '../../responses/forbidden.response';
import { OrderWithItemsResponse } from './responses/order-with-items.response';
import { OrderResponse } from './responses/order.response';
import { NotFoundResponse } from '../../responses/not-found.response';
import { UpdateResponse } from '../../responses/update.response';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
@UseGuards(AccessJwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @ApiOperation({
    summary: 'Get user orders list',
  })
  @ApiBadRequestResponse({ type: ValidationFailedResponse })
  @ApiOkResponse({ type: OrderListResponse })
  @UseInterceptors(ResponseEnvelopeInterceptor<Order>)
  @Get()
  findUserOrders(
    @Request() { user }: { user: Payload },
    @Query(new ZodValidationPipe(userOrderslistQuerySchema))
    query: UserOrdersListQueryDto,
  ) {
    return this.service.findAll({ userId: user.userId, ...query });
  }

  @ApiOperation({
    summary: 'Get all orders',
  })
  @ApiBadRequestResponse({ type: ValidationFailedResponse })
  @ApiForbiddenResponse({ type: ForbiddenResponse })
  @ApiOkResponse({ type: OrderListResponse })
  @Role(Roles.ADMIN)
  @UseGuards(RoleGuard)
  @UseInterceptors(ResponseEnvelopeInterceptor<Order>)
  @Get('list')
  findAll(
    @Query(new ZodValidationPipe(ordersListQuerySchema))
    ordersListQueryDto: OrdersListQueryDto,
  ) {
    return this.service.findAll(ordersListQueryDto);
  }

  @ApiOperation({
    summary: 'Get an order of user',
  })
  @ApiBadRequestResponse({ type: ValidationFailedResponse })
  @ApiOkResponse({ type: OrderWithItemsResponse })
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

  @ApiOperation({
    summary: 'Checkout the user cart to create an order',
  })
  @ApiBadRequestResponse({ type: ValidationFailedResponse })
  @ApiCreatedResponse({ type: OrderResponse })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  @Post('checkout')
  checkout(@Request() { user }: { user: Payload }) {
    return this.service.checkout(user.userId);
  }

  @ApiOperation({
    summary: 'Update status of order',
  })
  @ApiBadRequestResponse({ type: ValidationFailedResponse })
  @ApiForbiddenResponse({ type: ForbiddenResponse })
  @ApiOkResponse({ type: UpdateResponse })
  @Role(Roles.ADMIN)
  @UseGuards(RoleGuard)
  @Patch(':id/status')
  updateStatus(
    @Request() { user }: { user: Payload },
    @Body(new ZodValidationPipe(updateOrderStatusSchema))
    { status }: UpdateOrderStatusDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.updateStatus(id, user.userId, status);
  }
}
