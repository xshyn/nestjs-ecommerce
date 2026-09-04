import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { REDIS_CLIENT } from './cache.constants';
import { Redis } from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: Number(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
        });
      },
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
