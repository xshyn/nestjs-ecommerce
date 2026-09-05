import { z } from 'zod';
import { queryBaseSchema, withSkip } from '../../../schemas/query.schema';
import { Roles } from '../types/roles.enum';

export const userQuerySchema = queryBaseSchema
  .extend({
    id: z.uuid().optional(),
    email: z.email().optional(),
    roles: z.array(z.enum(Roles)).or(z.enum(Roles)).optional(),
  })
  .transform(withSkip);

export type UserQueryDto = z.infer<typeof userQuerySchema>;
