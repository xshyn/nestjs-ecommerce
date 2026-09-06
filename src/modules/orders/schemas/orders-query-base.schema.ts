import { z } from 'zod';
import { queryBaseSchema } from '../../../schemas/query.schema';
import { OrderStatus } from '../orders.type';
import { SortDirections } from '../../../types/sort-directions.type';
import { SortOrderOptions } from '../types/sort-order-options.type';

export const ordersQueryBaseSchema = queryBaseSchema
  .extend({
    status: z.enum(OrderStatus).optional(),
    lteAmount: z.coerce.number().positive().multipleOf(0.01).optional(),
    gteAmount: z.coerce.number().positive().multipleOf(0.01).optional(),
    id: z.uuid().optional(),
    sortDir: z.enum(SortDirections).optional().default(SortDirections.DESC),
    sortOption: z
      .enum(SortOrderOptions)
      .optional()
      .default(SortOrderOptions.CREATED_AT),
  })
  .refine((val) =>
    val?.lteAmount && val?.gteAmount ? val.lteAmount >= val.gteAmount : true,
  );

export type OrdersQueryBaseDto = z.infer<typeof ordersQueryBaseSchema>;
