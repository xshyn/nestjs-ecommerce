import { ApiResponseProperty } from '@nestjs/swagger';
import { format } from 'node:url';
import { ProductResponse } from '../../products/responses/product.response';

export class InventoryResponse {
  @ApiResponseProperty({ format: 'uuid' })
  id: string;

  @ApiResponseProperty({ format: 'uuid' })
  productId: string;

  @ApiResponseProperty({ type: 'number', example: '2' })
  quantity: string;

  @ApiResponseProperty({ format: 'date-time' })
  updatedAt: Date;
}
