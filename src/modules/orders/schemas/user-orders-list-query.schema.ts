import { z } from 'zod';
import { withSkip } from '../../../schemas/query.schema';
import { ordersQueryBaseSchema } from './orders-query-base.schema';
import { createZodDto } from 'nestjs-zod';

export const userOrderslistQuerySchema =
  ordersQueryBaseSchema.transform(withSkip);

export class UserOrdersListQueryDto extends createZodDto(
  userOrderslistQuerySchema,
) {}
