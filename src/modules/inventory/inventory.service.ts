import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './inventory.entity';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  find(options?: FindManyOptions<Inventory>) {
    return this.inventoryRepo.find(options);
  }

  findOne(where?: FindOptionsWhere<Inventory>) {
    return this.inventoryRepo.findOne({ where });
  }

  update(where: FindOptionsWhere<Inventory>, data: Inventory) {
    return this.inventoryRepo.update(where, data);
  }
}
