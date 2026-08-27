import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CartsModule } from './carts/carts.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [UsersModule, ProductsModule, OrdersModule, CartsModule, InventoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
