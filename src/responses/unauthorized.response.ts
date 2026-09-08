import { ApiResponseProperty } from '@nestjs/swagger';
import { ExceptionResponse } from './exception.response';
import { HttpStatus } from '@nestjs/common';

export class UnauthorizedResponse extends ExceptionResponse {
  @ApiResponseProperty({ example: 'Unauthorized' })
  message: string = 'Unauthorized';

  @ApiResponseProperty({ example: HttpStatus.UNAUTHORIZED })
  statusCode: number = HttpStatus.UNAUTHORIZED;
}
