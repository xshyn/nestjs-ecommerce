import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { OneProductResponse } from './one-product.response';
import { ResponseEnvelope } from '../../../types/response-envelope.interface';

export class ProductListResponse implements ResponseEnvelope<OneProductResponse> {
  @ApiResponseProperty({ type: 'number', example: 1 })
  count: number;

  @ApiProperty({ type: OneProductResponse, isArray: true })
  data: OneProductResponse[];
}
