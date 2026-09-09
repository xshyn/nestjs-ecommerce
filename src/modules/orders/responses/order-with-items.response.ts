import { ApiProperty } from '@nestjs/swagger';
import { OrderItemResponse } from './order-item.response';
import { OrderResponse } from './order.response';

export class OrderWithItemsResponse extends OrderResponse {
  @ApiProperty({ isArray: true, type: OrderItemResponse })
  items: OrderItemResponse[];
}
