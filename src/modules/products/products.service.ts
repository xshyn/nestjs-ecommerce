import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './products.entity';
import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  JsonContains,
  QueryDeepPartialEntity,
  Repository,
} from 'typeorm';
import { Inventory } from '../inventory/inventory.entity';
import { CacheService } from '../cache/cache.service';
import { CacheKeys } from '../cache/cache.keys';
import { CACHE_TTL, CACHE_VERSION } from '../cache/cache.constants';

@Injectable()
export class ProductsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly cacheService: CacheService,
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

  async find(where?: FindOptionsWhere<Product>, page?: number, take?: number) {
    return this.productRepo.find({
      where: where ? where : {},
      ...(take && { take }),
      ...(take && page && { skip: (page - 1) * take }),
      relations: { inventory: true },
    });
  }

  async list(
    where?: FindOptionsWhere<Product>,
    query?: { limit?: number; page?: number },
  ) {
    const limit = query?.limit ?? 10;
    const page = query?.page ?? 1;
    const queryKey = JSON.stringify({
      limit,
      page,
    });

    const cacheVersion = await this.cacheService.getVersion(
      CACHE_VERSION.PRODUCTS_LIST,
    );
    const cached = await this.cacheService.get(
      CacheKeys.productList(cacheVersion, queryKey),
    );

    if (cached) {
      return cached;
    }

    const products = await this.find(where, page, limit);

    await this.cacheService.set(
      CacheKeys.productList(cacheVersion, queryKey),
      products,
      CACHE_TTL.PRODUCT_LIST,
    );

    return products;
  }

  async findOne(options: FindOneOptions<Product>, throwIfNotFound = false) {
    const where = options.where as FindOptionsWhere<Product>;
    const cached = await this.cacheService.get<Product>(
      CacheKeys.product(
        await this.cacheService.getVersion(CACHE_VERSION.PRODUCTS),
        where.id as string,
      ),
    );
    if (cached) {
      return cached;
    }

    const product = await this.productRepo.findOne(options);
    if (!product && throwIfNotFound)
      throw new NotFoundException('Product not found');

    await this.cacheService.set<Product>(
      CacheKeys.product(
        await this.cacheService.getVersion(CACHE_VERSION.PRODUCTS),
        where.id as string,
      ),
      product as Product,
      CACHE_TTL.PRODUCT,
    );

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
