# Carts Module

Shopping cart management with inventory validation.

**Base path:** `/carts`

## Overview

The Carts module manages shopping carts for authenticated users. Each user has a single cart that is automatically created on first use. Cart items reference products and validate stock availability through the Inventory module before adding or updating quantities.

All endpoints require authentication (`AccessJwtAuthGuard`).

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/carts` | Get the current user's cart with items |
| `POST` | `/carts/items` | Add an item to the cart |
| `PATCH` | `/carts/items/:productId` | Update item quantity |
| `DELETE` | `/carts/items/:productId` | Remove an item from the cart |
| `DELETE` | `/carts` | Clear all items from the cart |

## Endpoints Detail

### Get Cart

```
Request:  GET /carts
Headers:  Authorization: Bearer <token>
Response: { id, userId, items: [{ id, productId, quantity }], createdAt, updatedAt }
```

Returns the user's cart. Creates one if it doesn't exist.

### Add Item

```
Request:  POST /carts/items
Headers:  Authorization: Bearer <token>
Body:     { productId: UUID, quantity: number }
Response: { id, cartId, productId, quantity }
```

- Validates that the product exists and is active.
- Checks inventory availability via `InventoryService.checkAvailability()`.
- If the item already exists in the cart, increments the quantity (upsert).
- Creates the cart if the user doesn't have one yet.

### Update Item Quantity

```
Request:  PATCH /carts/items/:productId
Headers:  Authorization: Bearer <token>
Body:     { quantity: number }
Response: { id, cartId, productId, quantity }
```

- Re-validates inventory availability for the new quantity.
- Throws `BadRequestException` if stock is insufficient.

### Remove Item

```
Request:  DELETE /carts/items/:productId
Headers:  Authorization: Bearer <token>
Response: { affected: number }
```

### Clear Cart

```
Request:  DELETE /carts
Headers:  Authorization: Bearer <token>
Response: { affected: number }
```

Removes all items from the cart.

## Entities

### Cart

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `userId` | UUID | Unique, foreign key to User |
| `createdAt` | timestamp | Auto-generated |
| `updatedAt` | timestamp | Auto-updated |

### CartItem

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `cartId` | UUID | Foreign key to Cart (CASCADE on delete) |
| `productId` | UUID | Foreign key to Product (RESTRICT on delete) |
| `quantity` | integer | 1–10,000 |

**Unique constraint:** `(cartId, productId)` — one entry per product per cart.

## Relations

- **Cart → User:** One-to-One
- **Cart → CartItem:** One-to-Many (cascade)
- **CartItem → Product:** Many-to-One (restrict — cannot delete a product that's in any cart)

## File Structure

```
carts/
├── carts.module.ts
├── carts.controller.ts
├── carts.service.ts
├── carts.entity.ts
├── cart-items.entity.ts
├── schemas/
│   ├── add-item.schema.ts
│   └── update-cart-quantity.schema.ts
├── responses/
│   ├── cart.response.ts
│   └── cart-item.response.ts
└── README.md
```
