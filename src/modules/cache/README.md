# Cache Module

Global Redis-based caching service with versioned invalidation.

**Scope:** Global (`@Global()` decorator)

## Overview

The Cache module provides a Redis-backed caching service available application-wide. It is used by the Products and Auth modules for:

- **Products:** Caching product listings and individual product queries with version-based invalidation.
- **Auth:** Storing refresh tokens and maintaining an access token blacklist.

The module manages a single Redis connection (`ioredis`) that is created on application bootstrap and destroyed on shutdown.

## Service API

### CacheService

```typescript
// Basic operations
await cacheService.get(key: string): Promise<string | null>
await cacheService.set(key: string, value: string, ttl?: number): Promise<void>
await cacheService.delete(key: string): Promise<void>
await cacheService.exists(key: string): Promise<boolean>

// Versioned cache
await cacheService.getVersion(versionKey: string): Promise<number>
await cacheService.incrementVersion(versionKey: string): Promise<number>
```

- `get` / `set` / `delete` / `exists` — standard Redis operations over JSON strings.
- `getVersion` / `incrementVersion` — used for cache invalidation. Incrementing a version effectively invalidates all entries keyed with the previous version number.

## Cache Keys

| Key Pattern | Purpose | TTL |
|---|---|---|
| `product:v{version}:{id}` | Single product cache | 60s |
| `products:list:v{version}:{query}` | Product list cache | 60s |
| `auth:blacklist:{jti}` | Blacklisted access tokens | Remaining token TTL |
| `auth:refresh:{jti}` | Active refresh tokens | 30 days |

## Cache Versioning

Cache entries include a version number in the key. When an entity is modified:

1. A TypeORM subscriber detects the change.
2. The subscriber calls `CacheService.incrementVersion()`.
3. All existing cache keys with the old version become stale (unreachable).
4. New queries generate keys with the updated version.

This approach avoids the need to track and delete individual cache keys.

## Configuration

| Environment Variable | Description | Default |
|---|---|---|
| `REDIS_HOST` | Redis server host | `localhost` |
| `REDIS_PORT` | Redis server port | `6379` |
| `REDIS_PASSWORD` | Redis password (optional) | — |

## Constants

```typescript
// cache.constants.ts
REDIS_CLIENT           // Injection token for the Redis client
CACHE_TTL.PRODUCT      // 60 seconds
CACHE_TTL.PRODUCT_LIST // 60 seconds
CACHE_VERSION.PRODUCTS // "products:version"
CACHE_VERSION.PRODUCTS_LIST // "products:list:version"
```

## File Structure

```
cache/
├── cache.module.ts
├── cache.service.ts
├── cache.constants.ts
├── cache.keys.ts
└── README.md
```
