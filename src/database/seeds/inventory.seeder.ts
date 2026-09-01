// src/database/seeds/inventory.seeder.ts
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Product } from '../../modules/products/products.entity';
import { Inventory } from '../../modules/inventory/inventory.entity';

export class InventorySeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager) {
    const productRepo = dataSource.getRepository(Product);
    const inventoryRepo = dataSource.getRepository(Inventory);
    const inventoryFactory = factoryManager.get(Inventory);

    const products = await productRepo.find();

    const existingInventories = await inventoryRepo.count();
    if (existingInventories > 0) {
      console.log('Inventories already seeded, skipping.');
      return;
    }

    for (const product of products) {
      const inventory = await inventoryFactory.make();
      inventory.product = product; // productId is set implicitly via the relation
      await inventoryRepo.save(inventory);
    }
  }
}