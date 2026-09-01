import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Cart } from './carts.entity';
import { Product } from '../products/products.entity';

@Entity('cart_items')
@Unique(['cartId', 'productId'])
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  cartId: string;

  @Column({ type: 'uuid' })
  productId: string;

  @Column({ type: 'integer' })
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.items, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
