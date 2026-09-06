import { z } from 'zod';
import { withSkip } from '../../../schemas/query.schema';
import { ordersQueryBaseSchema } from './orders-query-base.schema';

export const userOrderslistQuerySchema =
  ordersQueryBaseSchema.transform(withSkip);

export type UserOrdersListQueryDto = z.infer<typeof userOrderslistQuerySchema>;
