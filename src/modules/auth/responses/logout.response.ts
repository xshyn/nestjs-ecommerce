import { ApiResponseProperty } from '@nestjs/swagger';

export class LogoutResponse {
  @ApiResponseProperty({ type: 'string', example: 'Logged out successfully' })
  message: 'Logged out successfully';
}
