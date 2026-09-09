import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { ObjectLiteral, UpdateResult } from 'typeorm';

export class UpdateResponse implements UpdateResult {
  @ApiProperty({ isArray: true, example: [] })
  generatedMaps: ObjectLiteral[];

  @ApiProperty({ isArray: true, example: [] })
  raw: any[];

  @ApiResponseProperty({ type: 'number', example: 1 })
  affected: number;
}
