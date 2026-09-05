import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CartsModule } from './modules/carts/carts.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/users.entity';
import { Product } from './modules/products/products.entity';
import { Order } from './modules/orders/orders.entity';
import { OrderItem } from './modules/orders/order-item.entity';
import { Inventory } from './modules/inventory/inventory.entity';
import { Cart } from './modules/carts/carts.entity';
import { CartItem } from './modules/carts/cart-items.entity';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from './modules/cache/cache.module';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    OrdersModule,
    CartsModule,
    InventoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'nest_ecommerce',
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    CacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
