import { z } from 'zod';
import { Product } from '../products.entity';

export const createProductSchema = z.object({
  name: z.string().min(5).max(40),
  description: z.string().min(5).max(300).optional(),
  price: z.coerce.number().positive().max(1_000_000).multipleOf(0.01),
  isActive: z.coerce.boolean().default(true),
  quantity: z.coerce.number().int().min(1).max(10000),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
