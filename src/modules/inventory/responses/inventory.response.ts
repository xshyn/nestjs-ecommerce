import { ApiResponseProperty } from '@nestjs/swagger';
import { format } from 'node:url';

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
