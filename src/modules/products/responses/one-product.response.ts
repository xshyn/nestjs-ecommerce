import { ApiResponse, ApiResponseProperty } from '@nestjs/swagger';
import { ProductResponse } from './product.response';
import { InventoryResponse } from '../../inventory/responses/inventory.response';

export class OneProductResponse extends ProductResponse {
  @ApiResponseProperty({ type: InventoryResponse })
  inventory: InventoryResponse;
}
