import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
} from 'typeorm';
import { Inventory } from './inventory.entity';
import { CacheService } from '../cache/cache.service';
import { CacheKeys } from '../cache/cache.keys';
import { CACHE_VERSION } from '../cache/cache.constants';

@EventSubscriber()
export class InventorySubscriber implements EntitySubscriberInterface {
  constructor(
    dataSource: DataSource,
    private readonly cacheService: CacheService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Inventory;
  }
  async afterUpdate() {
    await this.invalidate();
  }

  private async invalidate() {
    await this.cacheService.incrementVersion(CACHE_VERSION.PRODUCTS);
    await this.cacheService.incrementVersion(CACHE_VERSION.PRODUCTS_LIST);
  }
}
