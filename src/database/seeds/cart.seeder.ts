// src/database/seeds/cart.seeder.ts
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Cart } from '../../modules/carts/carts.entity';
import { User } from '../../modules/users/users.entity';
import { Product } from '../../modules/products/products.entity';
import { CartItem } from '../../modules/carts/cart-items.entity';

export class CartSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager) {
    const cartRepo = dataSource.getRepository(Cart);
    const userRepo = dataSource.getRepository(User);
    const productRepo = dataSource.getRepository(Product);
    const cartItemFactory = factoryManager.get(CartItem);

    const existing = await cartRepo.count();
    if (existing > 0) {
      console.log('Carts already seeded, skipping.');
      return;
    }

    const users = await userRepo.find();
    const products = await productRepo.find();

    for (const user of users) {
      const cart = cartRepo.create({ user });

      const shuffled = [...products].sort(() => 0.5 - Math.random());
      const itemCount = Math.floor(Math.random() * 4); // 0 to 3
      const chosenProducts = shuffled.slice(0, itemCount);

      const items: CartItem[] = [];
      for (const product of chosenProducts) {
        const item = await cartItemFactory.make();
        item.product = product;
        items.push(item);
      }

      cart.items = items;
      await cartRepo.save(cart);
    }
  }
}
