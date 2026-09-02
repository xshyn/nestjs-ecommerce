import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './products.entity';
import {
  DataSource,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Inventory } from '../inventory/inventory.entity';
import { InventoryService } from '../inventory/inventory.service';

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

  findOne(where: FindOptionsWhere<Product>) {
    return this.productRepo.findOne({ where });
  }

  update(where: FindOptionsWhere<Product>, data: Product) {
    return this.productRepo.update(where, data);
  }

  delete(where: FindOptionsWhere<Product>) {
    return this.productRepo.delete(where);
  }
}
