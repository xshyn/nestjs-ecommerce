import { z } from 'zod';
import { queryBaseSchema, withSkip } from '../../../schemas/query.schema';
import { createZodDto } from 'nestjs-zod';

export const inventoryQuerySchema = queryBaseSchema
  .extend({
    id: z.uuid().optional(),
    gte: z.coerce.number().int().positive().max(10000).optional(),
    lte: z.coerce.number().int().positive().max(10000).optional(),
    sort: z
      .enum(['asc', 'desc'])
      .optional()
      .default('desc')
      .transform((val) => val.toUpperCase()),
  })
  .transform(withSkip)
  .refine((val) => {
    return val?.gte && val?.lte ? val.gte <= val.lte : true;
  });

export class InventoryQueryDto extends createZodDto(inventoryQuerySchema) {}
