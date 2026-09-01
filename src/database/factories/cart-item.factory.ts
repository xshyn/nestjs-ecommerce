// src/database/factories/cart-item.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { CartItem } from '../../modules/carts/cart-items.entity';

export default setSeederFactory(CartItem, () => {
  const cartItem = new CartItem();
  cartItem.quantity = faker.number.int({ min: 1, max: 5 });
  return cartItem;
});