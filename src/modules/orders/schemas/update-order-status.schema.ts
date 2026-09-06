import { z } from 'zod';
import { OrderStatus } from '../orders.type';

export const updateOrderStatusSchema = z.object({
  status: z.enum(OrderStatus),
});

export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;
