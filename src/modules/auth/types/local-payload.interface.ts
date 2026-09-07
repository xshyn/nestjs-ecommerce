import { Roles } from '../../users/types/roles.enum';

export interface LocalPayload {
  userId: string;
  roles: Roles[];
}
