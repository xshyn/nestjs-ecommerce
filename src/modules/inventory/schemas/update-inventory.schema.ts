import { z } from 'zod';

export const updateInventorySchema = z.object({
  quantity: z.coerce.number().int().min(1).max(10000),
});

export type UpdateInventoryDto = z.infer<typeof updateInventorySchema>;
