import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './products.entity';
import {
  DataSource,
  FindOneOptions,
  FindOptionsOrderValue,
  FindOptionsWhere,
  ILike,
  Repository,
} from 'typeorm';
import { Inventory } from '../inventory/inventory.entity';
import { CacheService } from '../cache/cache.service';
import { CacheKeys } from '../cache/cache.keys';
import { CACHE_TTL, CACHE_VERSION } from '../cache/cache.constants';
import { CreateProductDto } from './schemas/create-product.schema';
import { UpdateProductDto } from './schemas/update-product.schema';
import { ProductsQueryDto } from './schemas/products-query.schema';

@Injectable()
export class ProductsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly cacheService: CacheService,
  ) {}

  async save(createProductDto: CreateProductDto) {
    return this.dataSource.transaction(async (manager) => {
      const product = manager.create(Product, {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price.toFixed(2),
        isActive: createProductDto.isActive,
      });

      const savedProduct = await manager.save(Product, product);

      const inventory = manager.create(Inventory, {
        product: savedProduct,
        quantity: createProductDto.quantity,
      });

      await manager.save(Inventory, inventory);

      return savedProduct;
    });
  }

  async list(
    where?: FindOptionsWhere<Product>,
    productsQueryDto?: ProductsQueryDto,
  ) {
    const productFieldsQuery = {
      ...(productsQueryDto?.id && { id: productsQueryDto.id }),
      ...(productsQueryDto?.isActive !== undefined && {
        isActive: productsQueryDto.isActive,
      }),
    };

    const productPaginationQuery = {
      ...(productsQueryDto?.limit && { limit: productsQueryDto.limit }),
      ...(productsQueryDto?.page && { page: productsQueryDto.page }),
    };

    const searchExists = !!productsQueryDto?.search;

    const queryKey = JSON.stringify({
      ...productPaginationQuery,
      ...productFieldsQuery,
      ...(searchExists && {
        search: productsQueryDto.search!.trim(),
      }),
      sort: productsQueryDto?.sort,
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

    const products = await this.productRepo.find({
      take: productsQueryDto?.limit,
      skip: productsQueryDto?.skip,
      order: {
        createdAt:
          productsQueryDto?.sort.toUpperCase() as FindOptionsOrderValue,
      },
      where: [
        ...(productFieldsQuery ? [productFieldsQuery] : []),
        ...(searchExists
          ? [
              { name: ILike(`%${productsQueryDto.search}%`) },
              { description: ILike(`%${productsQueryDto.search}%`) },
            ]
          : []),
      ],
    });

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
    updateProductDto: UpdateProductDto,
    throwIfNotFound = false,
  ) {
    const result = await this.productRepo.update(where, {
      isActive: updateProductDto?.isActive,
      name: updateProductDto?.name,
      price: updateProductDto?.price?.toFixed(2),
      description: updateProductDto?.description,
    });
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
