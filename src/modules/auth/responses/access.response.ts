import { ApiResponseProperty } from '@nestjs/swagger';

export class AccessResponse {
  @ApiResponseProperty({ type: 'string' })
  access: string;
}
