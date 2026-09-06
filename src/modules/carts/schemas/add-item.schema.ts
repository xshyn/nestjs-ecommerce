import { z } from 'zod';

export const addItemSchema = z.object({
  productId: z.uuid(),
  quantity: z.coerce.number().int().min(1).max(10000),
});

export type AddItemDto = z.infer<typeof addItemSchema>;
