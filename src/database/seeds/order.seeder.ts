// src/database/seeds/order.seeder.ts
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Order } from '../../modules/orders/orders.entity';
import { User } from '../../modules/users/users.entity';
import { Product } from '../../modules/products/products.entity';
import { OrderItem } from '../../modules/orders/order-item.entity';

export class OrderSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager) {
    const orderRepo = dataSource.getRepository(Order);
    const userRepo = dataSource.getRepository(User);
    const productRepo = dataSource.getRepository(Product);

    const existing = await orderRepo.count();
    if (existing > 0) {
      console.log('Orders already seeded, skipping.');
      return;
    }

    const orderFactory = factoryManager.get(Order);

    const users = await userRepo.find();
    const products = await productRepo.find();

    if (!users.length || !products.length) {
      console.warn('No users or products found — seed those first.');
      return;
    }

    for (const user of users) {
      const orderCount = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < orderCount; i++) {
        const order = await orderFactory.make();
        order.user = user;

        const itemCount = Math.floor(Math.random() * 4) + 1;
        const items: OrderItem[] = [];
        let total = 0;

        for (let j = 0; j < itemCount; j++) {
          const product = products[Math.floor(Math.random() * products.length)];
          const quantity = Math.floor(Math.random() * 5) + 1;
          const unitPrice = parseFloat(product.price);
          const subtotal = unitPrice * quantity;

          const item = new OrderItem();
          item.product = product;
          item.productName = product.name;
          item.unitPrice = product.price;
          item.quantity = quantity;
          item.subtotal = subtotal.toFixed(2);

          total += subtotal;
          items.push(item);
        }

        order.totalAmount = total.toFixed(2);
        order.items = items;

        await orderRepo.save(order);
      }
    }
  }
}
