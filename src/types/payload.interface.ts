import { Roles } from '../modules/users/types/roles.enum';

export interface Payload {
  email: string;
  userId: string;
  roles: Roles[];
}
