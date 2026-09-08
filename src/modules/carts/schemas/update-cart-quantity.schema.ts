import { z } from 'zod';
import { updateInventorySchema } from '../../inventory/schemas/update-inventory.schema';
import { createZodDto } from 'nestjs-zod';

export const updateCartQuantitySchema = updateInventorySchema;
export class UpdateCartQuantityDto extends createZodDto(
  updateCartQuantitySchema,
) {}
