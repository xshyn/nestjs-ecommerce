// src/database/factories/order.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { Order } from '../../modules/orders/orders.entity';
import { faker } from '@faker-js/faker';
import { OrderStatus } from '../../modules/orders/orders.type';

export default setSeederFactory(Order, () => {
  const order = new Order();
  order.status = faker.helpers.enumValue(OrderStatus);
  order.totalAmount = '0.00';
  return order;
});
