import { ApiResponseProperty } from '@nestjs/swagger';

export class OrderItemResponse {
  @ApiResponseProperty({ format: 'uuid' })
  id: string;

  @ApiResponseProperty({ format: 'uuid' })
  orderId: string;

  @ApiResponseProperty({ format: 'uuid' })
  productId: string;

  @ApiResponseProperty({ example: 'Iphone 17 pro max' })
  productName: string;

  @ApiResponseProperty({ type: 'string', format: 'float', example: '99.99' })
  unitPrice: string;

  @ApiResponseProperty({ type: 'integer', example: 2 })
  quantity: number;

  @ApiResponseProperty({ type: 'string', format: 'float', example: '999.99' })
  subtotal: string;
}
