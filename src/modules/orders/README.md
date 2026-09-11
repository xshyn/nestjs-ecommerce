# Orders Module

Order creation (checkout) and order management.

**Base path:** `/orders`

## Overview

The Orders module handles the checkout flow — converting a user's shopping cart into an order — and provides endpoints for listing and viewing orders. The checkout process runs in a database transaction with pessimistic row locking on inventory to prevent overselling. Order items snapshot the product name and price at the time of purchase.

All endpoints require authentication. Listing all orders and updating order status are restricted to admin users.

## Endpoints

| Method | Endpoint | Guard | Description |
|---|---|---|---|
| `POST` | `/orders/checkout` | Bearer | Convert cart into an order |
| `GET` | `/orders` | Bearer | List current user's orders |
| `GET` | `/orders/list` | Admin | List all orders |
| `GET` | `/orders/:id` | Bearer | Get a specific order |
| `PATCH` | `/orders/:id/status` | Admin | Update order status |

## Endpoints Detail

### Checkout

```
Request:  POST /orders/checkout
Headers:  Authorization: Bearer <token>
Response: { id, userId, status, totalAmount, items: [...], createdAt, updatedAt }
```

**Process:**

1. Loads the user's cart with items and product relations.
2. Rejects if the cart is empty.
3. Acquires pessimistic write locks on inventory rows for all cart items.
4. Validates stock availability for each item.
5. Creates the order and order items (snapshotting `productName` and `unitPrice`).
6. Decrements inventory quantities.
7. Computes the `totalAmount` as the sum of all item subtotals.
8. Clears cart items (the cart itself remains).

All of this runs in a single database transaction. If any step fails, the entire transaction is rolled back.

### List User Orders

```
Request:  GET /orders?page=1&limit=10&status=PENDING&sort=createdAt&sortDir=DESC
Headers:  Authorization: Bearer <token>
Response: { count: number, data: Order[] }
```

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page |
| `id` | UUID | Filter by order ID |
| `status` | OrderStatus | Filter by status |
| `gteAmount` | number | Minimum total amount |
| `lteAmount` | number | Maximum total amount |
| `sort` | `createdAt` \| `totalAmount` | Sort field |
| `sortDir` | `ASC` \| `DESC` | Sort direction |

### List All Orders (Admin)

```
Request:  GET /orders/list?page=1&limit=10&userId=<uuid>
Headers:  Authorization: Bearer <admin-token>
Response: { count: number, data: Order[] }
```

Supports all user-order query parameters plus an additional `userId` filter.

### Get Order

```
Request:  GET /orders/:id
Headers:  Authorization: Bearer <token>
Response: { id, userId, status, totalAmount, items: [{ id, productId, productName, unitPrice, quantity, subtotal }], createdAt, updatedAt }
```

Users can only access their own orders.

### Update Order Status (Admin)

```
Request:  PATCH /orders/:id/status
Headers:  Authorization: Bearer <admin-token>
Body:     { status: OrderStatus }
Response: { id, userId, status, totalAmount, createdAt, updatedAt }
```

## Order Statuses

| Status | Description |
|---|---|
| `PENDING` | Order placed, awaiting payment (default) |
| `PAID` | Payment received |
| `PROCESSING` | Being prepared |
| `SHIPPED` | Shipped to customer |
| `DELIVERED` | Delivered to customer |
| `CANCELLED` | Order cancelled |

## Entities

### Order

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `userId` | UUID | Foreign key to User (RESTRICT on delete) |
| `status` | OrderStatus | Default: `PENDING` |
| `totalAmount` | decimal(12,2) | Sum of item subtotals |
| `createdAt` | timestamp | Auto-generated |
| `updatedAt` | timestamp | Auto-updated |

### OrderItem

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `orderId` | UUID | Foreign key to Order (CASCADE on delete) |
| `productId` | UUID | Foreign key to Product (SET NULL on delete) |
| `productName` | string | Snapshot of product name at purchase time |
| `unitPrice` | decimal | Snapshot of product price at purchase time |
| `quantity` | integer | Number of units |
| `subtotal` | decimal | `unitPrice * quantity` |

## Relations

- **Order → User:** Many-to-One (RESTRICT — cannot delete a user with orders)
- **Order → OrderItem:** One-to-Many (cascade)
- **OrderItem → Product:** Many-to-One (SET NULL — product deletion nulls the FK but preserves the snapshot)

## File Structure

```
orders/
├── orders.module.ts
├── orders.controller.ts
├── orders.service.ts
├── orders.entity.ts
├── order-item.entity.ts
├── orders.type.ts
├── schemas/
│   ├── orders-query-base.schema.ts
│   ├── orders-list-query.schema.ts
│   ├── user-orders-list-query.schema.ts
│   └── update-order-status.schema.ts
├── responses/
│   ├── order.response.ts
│   ├── order-item.response.ts
│   ├── order-with-items.response.ts
│   └── order-list.response.ts
└── README.md
```
