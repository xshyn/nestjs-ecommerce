# Inventory Module

Stock quantity management for products.

**Base path:** `/inventory`

## Overview

The Inventory module tracks stock quantities for each product. Each product has a one-to-one inventory record. Listing and updating inventory is restricted to admin users, while checking stock for a specific product is public. The service includes an `checkAvailability` helper used by the Carts and Orders modules to validate stock before adding items or processing checkout.

## Endpoints

| Method | Endpoint | Guard | Description |
|---|---|---|---|
| `GET` | `/inventory` | Admin | List all inventory records (paginated) |
| `GET` | `/inventory/:productId` | Public | Get inventory for a specific product |
| `PATCH` | `/inventory/:productId` | Admin | Update stock quantity |

## Endpoints Detail

### List Inventory (Admin)

```
Request:  GET /inventory?page=1&limit=10&gte=5&lte=100&sort=quantity&sortDirection=ASC
Headers:  Authorization: Bearer <admin-token>
Response: { count: number, data: Inventory[] }
```

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page |
| `id` | UUID | Filter by inventory record ID |
| `gte` | number | Minimum quantity (inclusive) |
| `lte` | number | Maximum quantity (inclusive) |
| `sort` | string | Sort field (default: `createdAt`) |
| `sortDirection` | `ASC` \| `DESC` | Sort direction (default: `DESC`) |

**Validation:** `gte` must be less than or equal to `lte`.

### Get Inventory by Product

```
Request:  GET /inventory/:productId
Response: { id, productId, quantity, updatedAt }
```

### Update Inventory (Admin)

```
Request:  PATCH /inventory/:productId
Body:     { quantity: number }
Response: { id, productId, quantity, updatedAt }
```

Quantity must be an integer between 1 and 10,000.

## Entity

### Inventory

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `productId` | UUID | Unique, foreign key to Product |
| `quantity` | integer | Default: 0, range: 1–10,000 |
| `updatedAt` | timestamp | Auto-updated |

## Relations

- **One-to-One** → `Product` (CASCADE on delete — deleting a product removes its inventory)

## Cache Invalidation

An `InventorySubscriber` increments the product cache version (`products:version`) after inventory updates, ensuring cached product data reflects the latest stock.

## Internal Usage

The `checkAvailability(product, quantity)` method is used by:

- **Carts module** — when adding or updating cart items
- **Orders module** — during checkout to validate stock before processing

```typescript
// Throws BadRequestException if insufficient stock
await this.inventoryService.checkAvailability(product, requestedQuantity);
```

## File Structure

```
inventory/
├── inventory.module.ts
├── inventory.controller.ts
├── inventory.service.ts
├── inventory.entity.ts
├── inventory.subscriber.ts
├── schemas/
│   ├── update-inventory.schema.ts
│   └── inventory-query.schema.ts
├── responses/
│   ├── inventory.response.ts
│   ├── inventory-with-product.response.ts
│   └── inventory-list.response.ts
└── README.md
```
