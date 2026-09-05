import { z } from 'zod';
import { Product } from '../products.entity';
import { createProductSchema } from './create-product.schema';

export const updateProductSchema = createProductSchema
  .omit({ quantity: true })
  .partial()

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
