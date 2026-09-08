import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Roles } from '../types/roles.enum';

export class UserResponse {
  @ApiResponseProperty({ format: 'uuid' })
  id: string;

  @ApiResponseProperty({
    format: 'email',
  })
  email: string;

  @ApiProperty({ enum: Roles, isArray: true })
  roles: Roles[];

  @ApiResponseProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiResponseProperty({ format: 'date-time' })
  updatedAt: Date;
}
