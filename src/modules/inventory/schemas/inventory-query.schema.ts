import { z } from 'zod';
import { queryBaseSchema, withSkip } from '../../../schemas/query.schema';

export const inventoryQuerySchema = queryBaseSchema
  .extend({
    id: z.uuid().optional(),
    gte: z.coerce.number().int().positive().max(10000).optional(),
    lte: z.coerce.number().int().positive().max(10000).optional(),
    sort: z.enum(['asc', 'desc']).optional().default('desc'),
  })
  .transform(withSkip)
  .refine((val) => {
    return val?.gte && val?.lte ? val.gte <= val.lte : true;
  });

export type InventoryQueryDto = z.infer<typeof inventoryQuerySchema>;
