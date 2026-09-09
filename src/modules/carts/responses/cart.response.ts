import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { CartItemResponse } from './cart-item.response';

export class CartResponse {
  @ApiResponseProperty({ format: 'uuid' })
  id: string;
  @ApiResponseProperty({ format: 'uuid' })
  userId: string;
  @ApiResponseProperty({ format: 'date-time' })
  createdAt: Date;
  @ApiResponseProperty({ format: 'date-time' })
  updatedAt: Date;
  @ApiProperty({ isArray: true, type: CartItemResponse })
  items: CartItemResponse[];
}
