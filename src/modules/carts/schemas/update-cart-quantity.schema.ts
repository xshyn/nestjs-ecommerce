import { z } from 'zod';
import { updateInventorySchema } from '../../inventory/schemas/update-inventory.schema';

export const updateCartQuantitySchema = updateInventorySchema;
export type UpdateCartQuantityDto = z.infer<typeof updateCartQuantitySchema>;
