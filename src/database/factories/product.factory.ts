import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { Product } from '../../modules/products/products.entity';
console.log('product.factory.ts loaded');
console.log('Product from factory file:', Product);
console.log('Product name:', Product.name);
export default setSeederFactory(Product, () => {
  const product = new Product();
  product.name = faker.commerce.productName();
  product.description = faker.commerce.productDescription();
  product.price = faker.commerce.price({ min: 10, max: 500 });
  product.isActive = faker.datatype.boolean({ probability: 0.85 });
  return product;
});
