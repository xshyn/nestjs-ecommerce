import { ApiResponseProperty } from '@nestjs/swagger';

export abstract class ExceptionResponse {
  @ApiResponseProperty()
  message: string;

  @ApiResponseProperty()
  statusCode: number;
}
