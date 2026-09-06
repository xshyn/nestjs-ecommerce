import { z } from 'zod';
import { queryBaseSchema, withSkip } from '../../../schemas/query.schema';

export const productsQuerySchema = queryBaseSchema
  .extend({
    search: z.string().nonempty().optional(),
    isActive: z.stringbool().optional(),
    id: z.uuid().optional(),
    sort: z
      .enum(['asc', 'desc'])
      .optional()
      .default('desc')
      .transform((val) => val.toUpperCase()),
  })
  .transform(withSkip);

export type ProductsQueryDto = z.infer<typeof productsQuerySchema>;
