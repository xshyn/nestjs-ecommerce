import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { UserResponse } from './user.response';
import { ResponseEnvelope } from '../../../types/response-envelope.interface';

export class UserListResponse implements ResponseEnvelope<UserResponse> {
  @ApiResponseProperty({ example: 1 })
  count: number;

  @ApiProperty({ type: UserResponse, isArray: true })
  data: UserResponse[];
}
