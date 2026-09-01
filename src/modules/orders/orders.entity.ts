import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from './orders.type';
import { User } from '../users/users.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  totalAmount: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
  })
  items: OrderItem[];
}
