import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Product } from '../../modules/products/products.entity';

export class ProductSeeder implements Seeder {
  track = false;

  async run(dataSource: DataSource, factoryManager: SeederFactoryManager) {
    const repo = dataSource.getRepository(Product);
    const existing = await repo.count();

    if (existing > 0) {
      console.log('Products already seeded, skipping.');
      return;
    }

    const factory = factoryManager.get(Product);
    await factory.saveMany(50);
  }
}
