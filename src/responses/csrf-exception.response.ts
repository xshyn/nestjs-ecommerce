import { HttpStatus } from '@nestjs/common';
import { ExceptionResponse } from './exception.response';
import { ApiResponseProperty } from '@nestjs/swagger';

export class CsrfExceptionResponse extends ExceptionResponse {
  @ApiResponseProperty({ example: HttpStatus.FORBIDDEN })
  statusCode: number = HttpStatus.FORBIDDEN;

  @ApiResponseProperty({ example: 'invalid csrf token' })
  message: string = 'invalid csrf token';
}
