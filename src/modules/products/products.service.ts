import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(data: Product) {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
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
