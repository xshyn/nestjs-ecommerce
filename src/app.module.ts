import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CartsModule } from './carts/carts.module';
import { InventoryModule } from './inventory/inventory.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Product } from './products/products.entity';
import { Order } from './orders/orders.entity';
import { OrderItem } from './orders/order-item.entity';
import { Inventory } from './inventory/inventory.entity';
import { Cart } from './carts/carts.entity';
import { CartItem } from './carts/cart-items.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    OrdersModule,
    CartsModule,
    InventoryModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'nest_ecommerce',
      synchronize: true,
      entities: [User, Product, Order, OrderItem, Inventory, Cart, CartItem],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
