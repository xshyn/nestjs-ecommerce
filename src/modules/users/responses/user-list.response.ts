import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { ResponseEnvelope } from '../../../interceptors/response-envelope.interceptor';
import { UserResponse } from './user.response';

export class UserListResponse implements ResponseEnvelope<UserResponse> {
  @ApiResponseProperty({ example: 1 })
  count: number;

  @ApiProperty({ type: UserResponse, isArray: true })
  data: UserResponse[];
}
