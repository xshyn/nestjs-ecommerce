import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { ProductSeeder } from './product.seeder';
import { UserSeeder } from './user.seeder';
import { InventorySeeder } from './inventory.seeder';
import { CartSeeder } from './cart.seeder';
import { OrderSeeder } from './order.seeder';

export class MainSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager) {
    await new UserSeeder().run(dataSource, factoryManager);
    await new ProductSeeder().run(dataSource, factoryManager);
    await new InventorySeeder().run(dataSource, factoryManager);
    await new CartSeeder().run(dataSource, factoryManager);
    await new OrderSeeder().run(dataSource, factoryManager);
  }
}
