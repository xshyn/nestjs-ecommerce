import { SetMetadata } from '@nestjs/common';
import { Roles } from '../modules/users/types/roles.enum';

export const ROLES_KEY = Symbol('roles');
export const Role = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);
