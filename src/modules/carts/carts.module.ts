import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './carts.entity';
import { CartItem } from './cart-items.entity';
import { ProductsModule } from '../products/products.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    ProductsModule,
    InventoryModule,
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
