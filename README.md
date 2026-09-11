<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">NestJS Ecommerce API</h1>

<p align="center">A full-featured RESTful Ecommerce API built with NestJS, TypeORM, PostgreSQL, Redis, and JWT authentication.</p>

<p align="center">
  <a href="https://nestjs.com" target="_blank">NestJS</a> •
  <a href="https://typeorm.org" target="_blank">TypeORM</a> •
  <a href="https://www.postgresql.org" target="_blank">PostgreSQL</a> •
  <a href="https://redis.io" target="_blank">Redis</a> •
  <a href="https://swagger.io" target="_blank">Swagger</a>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Modules](#modules)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
  - [Seeding the Database](#seeding-the-database)
- [API Documentation](#api-documentation)
- [Authentication & Security](#authentication--security)
- [API Endpoints Summary](#api-endpoints-summary)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [License](#license)

---

## Overview

This is a backend REST API for an ecommerce platform. It provides endpoints for user management, product catalog, inventory tracking, shopping carts, and order processing. The API implements JWT-based authentication with refresh token rotation, CSRF protection, role-based access control, Redis caching, and rate limiting.

## Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | NestJS 11 |
| Language | TypeScript 5.7 |
| ORM | TypeORM 0.3 |
| Database | PostgreSQL |
| Cache / Store | Redis (ioredis) |
| Auth | Passport (Local + JWT), bcrypt |
| Validation | Zod |
| API Docs | Swagger (OpenAPI) |
| Rate Limiting | @nestjs/throttler |
| CSRF | csrf-csrf (double-submit cookie) |

## Architecture

The application follows a modular architecture where each domain concern (auth, users, products, etc.) is encapsulated in its own NestJS module. Key architectural patterns:

- **Module-based organization** — each module bundles its controller, service, entity, DTOs/schemas, and response types
- **Zod validation** — request bodies and query params are validated through Zod schemas via a custom `ZodValidationPipe`
- **Response envelope** — list endpoints return `{ count, data }` via `ResponseEnvelopeInterceptor`
- **TypeORM subscribers** — cache invalidation is handled automatically on entity changes
- **Global middleware** — CORS, cookie parsing, rate limiting, and CSRF protection are applied globally or selectively

## Modules

| Module | Description | Documentation |
|---|---|---|
| **Auth** | Signup, login, token refresh, logout, CSRF tokens | [Auth Module](src/modules/auth/README.md) |
| **Users** | User profiles, admin user listing | [Users Module](src/modules/users/README.md) |
| **Products** | Product CRUD with cached listings | [Products Module](src/modules/products/README.md) |
| **Inventory** | Stock quantity management per product | [Inventory Module](src/modules/inventory/README.md) |
| **Carts** | Shopping cart and cart item operations | [Carts Module](src/modules/carts/README.md) |
| **Orders** | Checkout flow and order management | [Orders Module](src/modules/orders/README.md) |
| **Cache** | Global Redis cache service with versioned invalidation | [Cache Module](src/modules/cache/README.md) |

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **PostgreSQL** >= 14
- **Redis** >= 6

### Installation

```bash
git clone <repository-url>
cd ecommerce
npm install
```

### Environment Variables

Copy the example environment file and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USERNAME` | PostgreSQL user | `root` |
| `DB_PASSWORD` | PostgreSQL password | `root` |
| `DB_NAME` | Database name | `nest_ecommerce` |
| `JWT_SECRET_ACCESS` | Access token secret (min 32 chars) | `<random-string>` |
| `JWT_SECRET_REFRESH` | Refresh token secret (min 32 chars) | `<random-string>` |
| `CSRF_SECRET` | CSRF secret (min 32 chars) | `<random-string>` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_PASSWORD` | Redis password (optional) | — |

### Database Setup

Create the PostgreSQL database:

```sql
CREATE DATABASE nest_ecommerce;
```

The application uses `synchronize: true` in development, so tables are created automatically on startup.

### Running the Application

```bash
# Development (with file watching)
npm run start:dev

# Production
npm run build
npm run start:prod
```

The server starts at `http://localhost:3000` by default.

### Seeding the Database

Populate the database with sample data (30 users, 50 products, inventories, carts, orders):

```bash
npm run seed:run
```

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/api
```

The Swagger document is configured with Bearer authentication. You can obtain a token via `POST /auth/login` and paste it into the Swagger authorizer to test protected endpoints.

## Authentication & Security

| Feature | Implementation |
|---|---|
| Password hashing | bcrypt (salt rounds: 10) |
| Access tokens | JWT, 15-minute TTL, sent via `Authorization: Bearer` header |
| Refresh tokens | JWT, 30-day TTL, stored in httpOnly `refresh` cookie |
| Token rotation | Refreshing rotates both tokens; old access token is blacklisted in Redis |
| CSRF protection | Double-submit cookie pattern (`x-csrf-token` header) on refresh/logout |
| Role-based access | `@Role()` decorator + `RoleGuard` (roles: `user`, `admin`) |
| Rate limiting | Global throttler: 8 requests per 10 seconds |
| CORS | Configured for `http://localhost:3000` with credentials |

## API Endpoints Summary

### Auth (`/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | Public | Register a new user |
| POST | `/auth/login` | Public | Login and receive tokens |
| POST | `/auth/refresh` | Refresh cookie + CSRF | Rotate tokens |
| POST | `/auth/logout` | Bearer + CSRF | Revoke tokens |
| GET | `/auth/csrf-token` | Public | Get CSRF token |

### Users (`/users`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/users` | Admin | List all users (paginated) |
| GET | `/users/me` | Bearer | Get current user profile |

### Products (`/products`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/products` | Admin | Create a product |
| GET | `/products` | Public | List products (paginated, cached) |
| GET | `/products/:id` | Public | Get a product by ID (cached) |
| PATCH | `/products/:id` | Admin | Update a product |
| DELETE | `/products/:id` | Admin | Delete a product |

### Inventory (`/inventory`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/inventory` | Admin | List inventory (paginated) |
| GET | `/inventory/:productId` | Public | Get inventory for a product |
| PATCH | `/inventory/:productId` | Admin | Update stock quantity |

### Carts (`/carts`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/carts` | Bearer | Get current user's cart |
| POST | `/carts/items` | Bearer | Add item to cart |
| PATCH | `/carts/items/:productId` | Bearer | Update cart item quantity |
| DELETE | `/carts/items/:productId` | Bearer | Remove item from cart |
| DELETE | `/carts` | Bearer | Clear cart |

### Orders (`/orders`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/orders/checkout` | Bearer | Convert cart to order |
| GET | `/orders` | Bearer | List current user's orders |
| GET | `/orders/list` | Admin | List all orders |
| GET | `/orders/:id` | Bearer | Get order by ID |
| PATCH | `/orders/:id/status` | Admin | Update order status |

## Project Structure

```
src/
├── main.ts                          # Bootstrap (CORS, Swagger, cookie-parser)
├── config/
│   └── env.schema.ts                # Zod env validation
├── database/
│   ├── data-source.ts               # TypeORM DataSource (CLI/seeding)
│   ├── factories/                   # Faker factories for seeding
│   └── seeds/                       # Database seeders
├── decorators/
│   └── role.decorator.ts            # @Role() decorator
├── guards/
│   ├── access-jwt-auth.guard.ts
│   ├── access-refresh-jwt-auth.guard.ts
│   ├── local-auth.guard.ts
│   ├── refresh-jwt-auth.guard.ts
│   └── role.guard.ts
├── interceptors/
│   └── response-envelope.interceptor.ts
├── modules/
│   ├── app/                         # Root module
│   ├── auth/                        # Authentication
│   ├── cache/                       # Redis cache (global)
│   ├── carts/                       # Shopping carts
│   ├── csrf/                        # CSRF configuration
│   ├── inventory/                   # Stock management
│   ├── orders/                      # Order processing
│   ├── products/                    # Product catalog
│   └── users/                       # User management
├── pipes/
│   └── zod-validation.pipe.ts       # Zod validation pipe
├── responses/                       # Shared Swagger response DTOs
├── schemas/
│   └── query.schema.ts              # Shared pagination schemas
└── types/
    ├── payload.interface.ts
    ├── response-envelope.interface.ts
    └── sort-directions.type.ts
```

## Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Start in development mode with file watching |
| `npm run start:prod` | Start in production mode |
| `npm run build` | Compile the application |
| `npm run seed:run` | Seed the database with sample data |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:cov` | Run tests with coverage |
| `npm run test:e2e` | Run end-to-end tests |

## License

This project is licensed under the [MIT License](LICENSE).
