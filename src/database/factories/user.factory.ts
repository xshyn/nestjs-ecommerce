// src/database/factories/user.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { User } from '../../modules/users/users.entity';
import { Roles } from '../../modules/users/types/roles.enum';

export default setSeederFactory(User, async () => {
  const user = new User();
  user.email = faker.internet.email().toLowerCase();
  user.password = await bcrypt.hash('Passw0rd!', 10);
  user.roles = faker.helpers.arrayElement([
    [Roles.USER],
    [Roles.USER, Roles.ADMIN],
  ]);
  return user;
});
