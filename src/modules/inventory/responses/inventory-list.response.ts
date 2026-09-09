import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { ResponseEnvelope } from '../../../types/response-envelope.interface';
import { InventoryResponse } from './inventory.response';
import { InventoryWithProductResponse } from './inventory-with-product.response';

export class InventoryListResponse implements ResponseEnvelope<InventoryWithProductResponse> {
  @ApiResponseProperty({ type: 'number', format: 'float', example: 1 })
  count: number;

  @ApiProperty({ isArray: true, type: InventoryWithProductResponse })
  data: InventoryWithProductResponse[];
}
