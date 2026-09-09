import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { ResponseEnvelope } from '../../../types/response-envelope.interface';
import { OrderWithItemsResponse } from './order-with-items.response';

export class OrderListResponse implements ResponseEnvelope<OrderWithItemsResponse> {
  @ApiResponseProperty({ type: 'integer', example: '1' })
  count: number;

  @ApiProperty({ isArray: true, type: OrderWithItemsResponse })
  data: OrderWithItemsResponse[];
}
