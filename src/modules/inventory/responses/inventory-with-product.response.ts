import { ApiResponseProperty } from '@nestjs/swagger';
import { InventoryResponse } from './inventory.response';
import { ProductResponse } from '../../products/responses/product.response';

export class InventoryWithProductResponse extends InventoryResponse {
  @ApiResponseProperty({ type: ProductResponse })
  product: ProductResponse;
}
