import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { Product } from '../modules/products/products.entity';
import { Inventory } from '../modules/inventory/inventory.entity';
import { User } from '../modules/users/users.entity';
import { Order } from '../modules/orders/orders.entity';
import { OrderItem } from '../modules/orders/order-item.entity';
import { Cart } from '../modules/carts/carts.entity';
import { CartItem } from '../modules/carts/cart-items.entity';
import { ProductSeeder } from './seeds/product.seeder';
import { InventorySeeder } from './seeds/inventory.seeder';
import { UserSeeder } from './seeds/user.seeder';
import { OrderSeeder } from './seeds/order.seeder';
import { CartSeeder } from './seeds/cart.seeder';
import userFactory from './factories/user.factory';
import productFactory from './factories/product.factory';
import inventoryFactory from './factories/inventory.factory';
import orderFactory from './factories/order.factory';
import cartItemFactory from './factories/cart-item.factory';

config();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Product, Inventory, User, Order, OrderItem, Cart, CartItem],
  synchronize: false,
  seeds: [ProductSeeder, InventorySeeder, UserSeeder, OrderSeeder, CartSeeder],
  factories: [
    userFactory,
    productFactory,
    inventoryFactory,
    orderFactory,
    cartItemFactory,
    
  ],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
