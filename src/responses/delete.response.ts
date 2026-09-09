import { OmitType } from '@nestjs/swagger';
import { UpdateResponse } from './update.response';

export class DeleteResponse extends OmitType(UpdateResponse, [
  'generatedMaps',
] as const) {}
