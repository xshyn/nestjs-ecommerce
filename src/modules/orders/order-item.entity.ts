import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './orders.entity';
import { Product } from '../products/products.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orderId: string;

  @Column({ type: 'uuid', nullable: true })
  productId: string | null;

  @Column({ type: 'text' })
  productName: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  unitPrice: string;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  subtotal: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'productId' })
  product: Product | null;
}
