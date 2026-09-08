import { z } from 'zod';
import { ordersQueryBaseSchema } from './orders-query-base.schema';
import { withSkip } from '../../../schemas/query.schema';
import { createZodDto } from 'nestjs-zod';

export const ordersListQuerySchema = ordersQueryBaseSchema
  .extend({
    userId: z.uuid().optional(),
  })
  .transform(withSkip);

export class OrdersListQueryDto extends createZodDto(ordersListQuerySchema) {}
