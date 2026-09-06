import { z } from 'zod';
import { ordersQueryBaseSchema } from './orders-query-base.schema';
import { withSkip } from '../../../schemas/query.schema';

export const ordersListQuerySchema = ordersQueryBaseSchema
  .extend({
    userId: z.uuid().optional(),
  })
  .transform(withSkip);

export type OrdersListQueryDto = z.infer<typeof ordersListQuerySchema>;
