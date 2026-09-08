import { z } from 'zod';
import { OrderStatus } from '../orders.type';
import { createZodDto } from 'nestjs-zod';

export const updateOrderStatusSchema = z.object({
  status: z.enum(OrderStatus),
});


export class UpdateOrderStatusDto extends createZodDto(updateOrderStatusSchema) {}