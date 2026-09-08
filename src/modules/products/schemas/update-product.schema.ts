import { z } from 'zod';
import { Product } from '../products.entity';
import { createProductSchema } from './create-product.schema';
import { createZodDto } from 'nestjs-zod';

export const updateProductSchema = createProductSchema
  .omit({ quantity: true })
  .partial();

export class UpdateProductDto extends createZodDto(updateProductSchema) {}
