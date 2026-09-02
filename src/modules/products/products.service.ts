import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './products.entity';
import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryDeepPartialEntity,
  Repository,
} from 'typeorm';
import { Inventory } from '../inventory/inventory.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async save(data: Product) {
    return this.dataSource.transaction(async (manager) => {
      const product = manager.create(Product, {
        name: data.name,
        description: data.description,
        price: data.price,
      });

      const savedProduct = await manager.save(Product, product);

      const inventory = manager.create(Inventory, {
        product: savedProduct,
        quantity: 0,
      });

      await manager.save(Inventory, inventory);

      return savedProduct;
    });
  }

  find(options?: FindManyOptions<Product>) {
    return this.productRepo.find(options);
  }

  async findOne(options: FindOneOptions<Product>, throwIfNotFound = false) {
    const product = await this.productRepo.findOne(options);
    if (!product && throwIfNotFound)
      throw new NotFoundException('Product not found');
    return product;
  }

  async update(
    where: FindOptionsWhere<Product>,
    data: QueryDeepPartialEntity<Product>,
    throwIfNotFound = false,
  ) {
    const result = await this.productRepo.update(where, data);
    if ((!result.affected || result.affected < 1) && throwIfNotFound)
      throw new NotFoundException('Product not found');
    return result;
  }

  async delete(where: FindOptionsWhere<Product>, throwIfNotFound = false) {
    const result = await this.productRepo.delete(where);
    if ((!result.affected || result.affected < 1) && throwIfNotFound)
      throw new NotFoundException('Product not found');
    return result;
  }

  async exists(where: FindOptionsWhere<Product>, throwIfNotFound = false) {
    const result = await this.productRepo.exists({ where });
    if (!result && throwIfNotFound)
      throw new NotFoundException('Product not found');
    return result;
  }
}
