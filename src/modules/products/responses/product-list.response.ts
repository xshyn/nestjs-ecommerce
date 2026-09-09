import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { ResponseEnvelope } from '../../../interceptors/response-envelope.interceptor';
import { OneProductResponse } from './one-product.response';

export class ProductListResponse implements ResponseEnvelope<OneProductResponse> {
  @ApiResponseProperty({ type: 'number', example: 1 })
  count: number;

  @ApiProperty({ type: OneProductResponse, isArray: true })
  data: OneProductResponse[];
}
