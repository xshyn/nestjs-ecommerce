import { ApiResponseProperty } from '@nestjs/swagger';

export class CsrfResponse {
  @ApiResponseProperty({ type: 'string' })
  csrf: string;
}
