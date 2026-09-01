// src/database/seeds/user.seeder.ts
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../modules/users/users.entity';

export class UserSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager) {
    const repo = dataSource.getRepository(User);
    const existing = await repo.count();
    if (existing > 0) {
      console.log('Users already seeded, skipping.');
      return;
    }

    const factory = factoryManager.get(User);
    await factory.saveMany(30);
  }
}
