// src/database/factories/inventory.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { Inventory } from '../../modules/inventory/inventory.entity';
import { faker } from '@faker-js/faker';

export default setSeederFactory(Inventory, () => {
  const inventory = new Inventory();
  inventory.quantity = faker.number.int({ min: 0, max: 500 });
  return inventory;
});
