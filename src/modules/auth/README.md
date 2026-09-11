# Auth Module

Handles user authentication, JWT token management, and CSRF protection.

**Base path:** `/auth`

## Overview

The Auth module provides a complete authentication flow including user registration, login with JWT access/refresh token pair, token rotation with blacklisting, and logout. It uses Passport strategies for local and JWT authentication, and implements double-submit CSRF protection for sensitive endpoints.

## Endpoints

| Method | Endpoint | Guard | CSRF | Description |
|---|---|---|---|---|
| `POST` | `/auth/signup` | — | No | Register a new user account |
| `POST` | `/auth/login` | `LocalAuthGuard` | No | Authenticate and receive tokens |
| `POST` | `/auth/refresh` | `AccessRefreshJwtAuthGuard` + `RefreshJwtAuthGuard` | Yes | Rotate access and refresh tokens |
| `POST` | `/auth/logout` | `AccessJwtAuthGuard` | Yes | Revoke tokens and clear cookie |
| `GET` | `/auth/csrf-token` | — | No | Get a fresh CSRF token |

## Authentication Flow

### Signup

```
Request:  POST /auth/signup
Body:     { email: string, password: string }
Response: 201 Created
```

- Password must be 8–64 characters with at least one lowercase letter, one uppercase letter, one number, and one special character.
- Password is hashed with bcrypt (salt rounds: 10) before storage.

### Login

```
Request:  POST /auth/login
Body:     { email: string, password: string }
Response: 200 { access: "<jwt>" }
Cookie:   refresh=<jwt> (httpOnly, secure in prod, sameSite: strict, 30-day TTL)
```

- Validates credentials against the database.
- Returns an access token (15-minute TTL) in the response body.
- Sets a refresh token (30-day TTL) in an httpOnly cookie named `refresh`.

### Token Refresh

```
Request:  POST /auth/refresh
Headers:  x-csrf-token: <csrf-token>
Cookie:   refresh=<jwt>
Response: 200 { access: "<new-jwt>" }
Cookie:   refresh=<new-jwt>
```

- The old access token JTI is blacklisted in Redis (TTL = remaining expiration).
- Both tokens are rotated; new access token returned in body, new refresh token set in cookie.
- Requires a valid CSRF token in the `x-csrf-token` header.

### Logout

```
Request:  POST /auth/logout
Headers:  Authorization: Bearer <access-token>, x-csrf-token: <csrf-token>
Response: 200 { message: "Logged out successfully" }
Cookie:   refresh= (cleared)
```

- Blacklists the access token JTI in Redis.
- Revokes the refresh token from Redis.
- Clears the `refresh` cookie.

## Token Details

| Property | Access Token | Refresh Token |
|---|---|---|
| Delivery | `Authorization: Bearer` header | `refresh` httpOnly cookie |
| TTL | 15 minutes | 30 days |
| Secret | `JWT_SECRET_ACCESS` | `JWT_SECRET_REFRESH` |
| Payload | `{ userId, roles, type: "access", jti }` | `{ userId, roles, type: "refresh", jti }` |
| Storage | Client-side (memory/localStorage) | Redis (`auth:refresh:{jti}`) |

## Guards

| Guard | Strategy | Purpose |
|---|---|---|
| `LocalAuthGuard` | `passport-local` (email field) | Validates login credentials |
| `AccessJwtAuthGuard` | Bearer token | Protects routes requiring authentication |
| `RefreshJwtAuthGuard` | Refresh cookie | Validates refresh token from cookie |
| `AccessRefreshJwtAuthGuard` | Bearer (ignores expiry) | Used on refresh endpoint to accept expired access tokens for blacklisting |

## CSRF Protection

Uses the `csrf-csrf` library with a double-submit cookie pattern:

- **Cookie name:** `__Host-csrf` (production) / `csrf` (development)
- **Header:** `x-csrf-token`
- **Session identifier:** SHA-256 hash of the `refresh` cookie value
- Applied selectively to `POST /auth/refresh` and `POST /auth/logout` via `AuthModule.configure()`

## Schemas

### Signup / Login Schema

```typescript
{
  email: string,       // valid email format
  password: string     // 8-64 chars, min 1 lowercase, 1 uppercase, 1 number, 1 special char
}
```

## File Structure

```
auth/
├── auth.module.ts
├── auth.controller.ts
├── schemas/
│   ├── signup.schema.ts
│   └── login.schema.ts
├── services/
│   ├── auth.service.ts
│   └── token.service.ts
├── strategies/
│   ├── local.strategy.ts
│   ├── access-jwt.strategy.ts
│   ├── refresh-jwt.strategy.ts
│   └── access-refresh-jwt.strategy.ts
├── types/
│   ├── token-type.ts
│   ├── token-ttl.ts
│   └── local-payload.interface.ts
├── responses/
│   ├── access.response.ts
│   ├── logout.response.ts
│   └── csrf.response.ts
└── README.md
```
