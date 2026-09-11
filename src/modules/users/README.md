# Users Module

Manages user profiles and provides admin-level user listing.

**Base path:** `/users`

## Overview

The Users module handles user data retrieval and listing. It exposes the authenticated user's own profile and an admin-only endpoint for querying all users with filtering, searching, sorting, and pagination.

## Endpoints

| Method | Endpoint | Guard | Description |
|---|---|---|---|
| `GET` | `/users` | `AccessJwtAuthGuard` + `RoleGuard` (admin) | List all users with filtering and pagination |
| `GET` | `/users/me` | `AccessJwtAuthGuard` | Get the current user's profile |

## Endpoints Detail

### List Users (Admin)

```
Request:  GET /users?page=1&limit=10&search=john&roles=user&sort=createdAt&sortDirection=DESC
Headers:  Authorization: Bearer <admin-token>
Response: { count: number, data: User[] }
```

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page |
| `id` | UUID | Filter by user ID |
| `email` | string | Filter by exact email |
| `roles` | `user` \| `admin` | Filter by role |
| `search` | string | Case-insensitive search on email |
| `sort` | string | Sort field (default: `createdAt`) |
| `sortDirection` | `ASC` \| `DESC` | Sort direction (default: `DESC`) |

### Get Current User

```
Request:  GET /users/me
Headers:  Authorization: Bearer <token>
Response: { id, email, roles, createdAt, updatedAt }
```

## Entity

### User

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key, auto-generated |
| `email` | string | Unique |
| `password` | string | Select: false (excluded from default queries) |
| `roles` | `Roles[]` | Postgres enum array, default `['user']` |
| `createdAt` | timestamp | Auto-generated |
| `updatedAt` | timestamp | Auto-updated |

### Roles Enum

| Value | Description |
|---|---|
| `user` | Regular user (default) |
| `admin` | Administrator with elevated permissions |

## Relations

- **One-to-One** → `Cart` (a user has one cart)
- **One-to-Many** → `Order` (a user can have multiple orders)

## File Structure

```
users/
├── users.module.ts
├── users.controller.ts
├── users.service.ts
├── users.entity.ts
├── schemas/
│   └── user-query.schema.ts
├── types/
│   └── roles.enum.ts
├── responses/
│   ├── user.response.ts
│   └── user-list.response.ts
└── README.md
```
