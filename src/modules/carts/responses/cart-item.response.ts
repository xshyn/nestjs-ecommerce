import { ApiResponseProperty } from '@nestjs/swagger';

export class CartItemResponse {
  @ApiResponseProperty({ format: 'uuid' })
  id: string;
  @ApiResponseProperty({ format: 'uuid' })
  cartId: string;
  @ApiResponseProperty({ format: 'uuid' })
  productId: string;
  @ApiResponseProperty({ type: 'integer', example: '2' })
  quantity: number;
}
