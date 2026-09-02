import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './inventory.entity';
import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryDeepPartialEntity,
  Repository,
} from 'typeorm';
import { Product } from '../products/products.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  find(options?: FindManyOptions<Inventory>) {
    return this.inventoryRepo.find(options);
  }

  async findOne(options: FindOneOptions<Inventory>, throwIfNotFound = false) {
    const inventory = await this.inventoryRepo.findOne(options);
    if (!inventory && throwIfNotFound)
      throw new NotFoundException('Inventory not found');
    return inventory;
  }

  async update(
    where: FindOptionsWhere<Inventory>,
    data: QueryDeepPartialEntity<Inventory>,
    throwIfNotFound = false,
  ) {
    const result = await this.inventoryRepo.update(where, data);
    if ((!result.affected || result.affected < 1) && throwIfNotFound)
      throw new NotFoundException('Inventory not found');
    return result;
  }

  async checkAvailability(product: Product, quantity: number) {
    if (!product?.inventory) throw new NotFoundException('Inventory not found');
    if (product.inventory.quantity < quantity) {
      throw new BadRequestException('Insufficient inventory quantity');
    }
    return true;
  }
}
