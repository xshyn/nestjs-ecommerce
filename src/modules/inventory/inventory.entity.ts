import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../products/products.entity';

@Entity('inventories')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  productId: string;

  @Column({ type: 'integer', default: 0 })
  quantity: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Product, (product) => product.inventory)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
