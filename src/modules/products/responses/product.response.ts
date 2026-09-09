import { ApiResponseProperty } from '@nestjs/swagger';

export class ProductResponse {
  @ApiResponseProperty({ format: 'uuid' })
  id: string;

  @ApiResponseProperty({ type: 'string', example: 'Mac Book Air' })
  name: string;

  @ApiResponseProperty()
  description: string;

  @ApiResponseProperty({ type: 'string', format: 'float', example: '999.99' })
  price: string;

  @ApiResponseProperty({ type: 'boolean' })
  isActive: boolean;

  @ApiResponseProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiResponseProperty({ format: 'date-time' })
  updatedAt: Date;
}
