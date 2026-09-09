import { ApiResponseProperty } from '@nestjs/swagger';
import { OrderStatus } from '../orders.type';

export class OrderResponse {
  @ApiResponseProperty({ format: 'uuid' })
  id: string;

  @ApiResponseProperty({ format: 'uuid' })
  userId: string;

  @ApiResponseProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiResponseProperty({ type: 'string', format: 'float', example: '999.99' })
  totalAmount: string;

  @ApiResponseProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiResponseProperty({ format: 'date-time' })
  updatedAt: Date;
}
