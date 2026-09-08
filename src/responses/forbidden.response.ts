import { HttpStatus } from '@nestjs/common';
import { ExceptionResponse } from './exception.response';
import { ApiResponseProperty } from '@nestjs/swagger';

export class ForbiddenResponse extends ExceptionResponse {
  @ApiResponseProperty({ example: 'Forbidden' })
  message: string = 'Forbidden';

  @ApiResponseProperty({ example: HttpStatus.FORBIDDEN })
  statusCode: number = HttpStatus.FORBIDDEN;
}
