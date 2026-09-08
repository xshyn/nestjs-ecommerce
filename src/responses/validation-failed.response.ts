import { ApiResponseProperty } from '@nestjs/swagger';
import { ExceptionResponse } from './exception.response';
import { HttpStatus } from '@nestjs/common';

export class ValidationFailedResponse extends ExceptionResponse {
  @ApiResponseProperty({ example: 'Validation Failed' })
  message: string = 'Validation Failed';
  @ApiResponseProperty({ example: 'Bad Request' })
  error: string = 'Bad Request';
  @ApiResponseProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number = HttpStatus.BAD_REQUEST;
}
