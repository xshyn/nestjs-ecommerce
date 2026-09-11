# Products Module

Product catalog management with CRUD operations and Redis caching.

**Base path:** `/products`

## Overview

The Products module provides full CRUD functionality for the product catalog. List and detail endpoints are publicly accessible and cached in Redis with version-based invalidation. Create, update, and delete operations are restricted to admin users. Creating a product automatically creates its associated inventory record in a database transaction.

## Endpoints

| Method | Endpoint | Guard | Description |
|---|---|---|---|
| `POST` | `/products` | Admin | Create a new product with inventory |
| `GET` | `/products` | Public | List products (cached, paginated) |
| `GET` | `/products/:id` | Public | Get a single product by ID (cached) |
| `PATCH` | `/products/:id` | Admin | Update a product |
| `DELETE` | `/products/:id` | Admin | Delete a product |

## Endpoints Detail

### Create Product (Admin)

```
Request:  POST /products
Headers:  Authorization: Bearer <admin-token>
Body:     { name, description, price, isActive?, quantity }
Response: 201 { id, name, description, price, isActive, inventory: { quantity }, createdAt, updatedAt }
```

Creates both the product and its inventory record in a single transaction.

### List Products

```
Request:  GET /products?page=1&limit=10&search=phone&isActive=true&sort=createdAt&sortDirection=DESC
Response: { count: number, data: Product[] }
```

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page |
| `id` | UUID | Filter by product ID |
| `isActive` | boolean | Filter by active status |
| `search` | string | Case-insensitive search on name and description |
| `sort` | string | Sort field (default: `createdAt`) |
| `sortDirection` | `ASC` \| `DESC` | Sort direction (default: `DESC`) |

Results are cached in Redis with a 60-second TTL.

### Get Product

```
Request:  GET /products/:id
Response: { id, name, description, price, isActive, inventory: { quantity, updatedAt }, createdAt, updatedAt }
```

Cached in Redis. Returns the product with its inventory relation.

### Update Product (Admin)

```
Request:  PATCH /products/:id
Body:     { name?, description?, price?, isActive? }
Response: { id, name, description, price, isActive, createdAt, updatedAt }
```

Does not allow updating inventory quantity (use the Inventory module for that).

### Delete Product (Admin)

```
Request:  DELETE /products/:id
Response: { affected: number }
```

Cascade deletes the associated inventory record.

## Entity

### Product

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | varchar | 5–40 characters |
| `description` | text | Nullable, 5–300 characters |
| `price` | decimal(12,2) | Positive, max 1,000,000, step 0.01 |
| `isActive` | boolean | Default: `true` |
| `createdAt` | timestamp | Auto-generated |
| `updatedAt` | timestamp | Auto-updated |

## Relations

- **One-to-One** → `Inventory` (stock quantity)
- **One-to-Many** → `CartItem` (cart references)
- **One-to-Many** → `OrderItem` (order references)

## Caching Strategy

- List and single-product queries are cached in Redis.
- Cache keys include a version number: `product:v{version}:{id}`.
- A TypeORM subscriber (`ProductsSubscriber`) increments cache versions on insert/update/remove, effectively invalidating all cached entries for that entity.
- Cache TTL: 60 seconds.

## File Structure

```
products/
├── products.module.ts
├── products.controller.ts
├── products.service.ts
├── products.entity.ts
├── products.subscriber.ts
├── schemas/
│   ├── create-product.schema.ts
│   ├── update-product.schema.ts
│   └── products-query.schema.ts
├── responses/
│   ├── product.response.ts
│   ├── one-product.response.ts
│   └── product-list.response.ts
└── README.md
```
