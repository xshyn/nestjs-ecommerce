import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './inventory.entity';
import {
  Between,
  FindOneOptions,
  FindOptionsOrderValue,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  QueryDeepPartialEntity,
  Repository,
} from 'typeorm';
import { Product } from '../products/products.entity';
import { InventoryQueryDto } from './schemas/inventory-query.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  find(inventoryQueryDto?: InventoryQueryDto) {
    const isGte = inventoryQueryDto?.gte !== undefined;
    const isLte = inventoryQueryDto?.lte !== undefined;
    const isBetween = isGte && isLte;
    return this.inventoryRepo.find({
      take: inventoryQueryDto?.limit,
      skip: inventoryQueryDto?.skip,
      order: {
        quantity:
          inventoryQueryDto?.sort.toUpperCase() as FindOptionsOrderValue,
      },
      relations: { product: true },
      where: {
        ...(isGte || isLte
          ? ({
              quantity: isBetween
                ? Between(inventoryQueryDto.gte, inventoryQueryDto.lte)
                : isGte
                  ? MoreThanOrEqual(inventoryQueryDto.gte)
                  : LessThanOrEqual(inventoryQueryDto.lte),
            } as FindOptionsWhere<Inventory>)
          : undefined),
        ...(inventoryQueryDto?.id && { id: inventoryQueryDto.id }),
      },
    });
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
