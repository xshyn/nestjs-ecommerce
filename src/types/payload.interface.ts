import { Roles } from '../modules/users/types/roles.enum';
import { TokenType } from '../modules/auth/types/token-type.enum';

export interface Payload {
  userId: string;
  roles: Roles[];
  type: TokenType;
  jti: string;
  iat: number;
  exp: number;
}

export interface AccessPayload extends Payload {
  type: TokenType.ACCESS;
}

export interface RefreshPayload extends Payload {
  type: TokenType.REFRESH;
}
