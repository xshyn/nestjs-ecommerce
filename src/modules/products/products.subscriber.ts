import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
} from 'typeorm';
import { CacheService } from '../cache/cache.service';
import { Product } from './products.entity';
import { CACHE_VERSION } from '../cache/cache.constants';

@EventSubscriber()
export class ProductsSubscriber implements EntitySubscriberInterface {
  constructor(
    dataSource: DataSource,
    private readonly cacheService: CacheService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Product;
  }

  async afterInsert() {
    await this.invalidate();
  }
  async afterRemove() {
    await this.invalidate();
  }
  async afterUpdate() {
    await this.invalidate();
  }

  private async invalidate() {
    await this.cacheService.incrementVersion(CACHE_VERSION.PRODUCTS);
    await this.cacheService.incrementVersion(CACHE_VERSION.PRODUCTS_LIST);
  }
}
