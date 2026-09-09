import { HttpStatus } from '@nestjs/common';
import { ExceptionResponse } from './exception.response';
import { ApiResponseProperty } from '@nestjs/swagger';

export class NotFoundResponse extends ExceptionResponse {
  @ApiResponseProperty({ example: 'Not Found' })
  message: string = 'Not Found';

  @ApiResponseProperty({ example: HttpStatus.NOT_FOUND })
  statusCode: number = HttpStatus.NOT_FOUND;
}
