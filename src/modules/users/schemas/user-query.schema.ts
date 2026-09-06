import { z } from 'zod';
import { queryBaseSchema, withSkip } from '../../../schemas/query.schema';
import { Roles } from '../types/roles.enum';
import { SortDirections } from '../../../types/sort-directions.type';

export const userQuerySchema = queryBaseSchema
  .extend({
    id: z.uuid().optional(),
    email: z.email().optional(),
    roles: z.array(z.enum(Roles)).or(z.enum(Roles)).optional(),
    search: z.string().nonempty().optional(),
    sort: z
      .enum(SortDirections)
      .optional()
      .default(SortDirections.DESC)
      .transform((val) => val.toUpperCase()),
  })
  .transform(withSkip);

export type UserQueryDto = z.infer<typeof userQuerySchema>;
