<div align="center">

# Authentication + JWT Refresh Token Flow

NestJS + MySQL reference implementation that demonstrates a short-lived access token paired with a long-lived refresh token, password hashing, and Sequelize persistence.

</div>

## Features

- `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh` endpoints
- BCrypt password hashing and refresh token storage per user
- JWT access token (1 minute) + refresh token (7 days) lifecycle
- NestJS modules with Sequelize + MySQL for persistence

## Project Structure

- `src/auth`: DTOs, controller, and service that issue/refresh tokens
- `src/users`: Sequelize model + service that manages user records
- `src/app.module.ts`: central wiring (Sequelize + Auth + Users modules)

### User Model

`User` contains `email`, `password`, and `referenceToken` (refresh token column). Tokens are currently stored in plain text for clarity—consider hashing them before production use.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 10+
- MySQL 8+ running locally

### Installation & Setup

```
git clone <repo-url>
cd athentic
npm install
```

Update the database credentials inside `src/app.module.ts` if they differ from your local MySQL setup (default assumes `root:root@localhost:3306` with database `athentic_db`). Tables are auto-created because `synchronize: true` is enabled.

### Running the API

```
# development (hot reload)
npm run start:dev

# production
npm run start:prod
```

The server listens on `http://localhost:3000`.

## API Reference

Base path: `http://localhost:3000/auth`

| Endpoint | Body | Description |
| --- | --- | --- |
| `POST /register` | `{ "email": "user@example.com", "password": "P@ssw0rd" }` | Creates a user, stores the hashed password, and returns initial access + refresh tokens. |
| `POST /login` | `{ "email": "user@example.com", "password": "P@ssw0rd" }` | Verifies credentials, issues new token pair, and persists the refresh token. |
| `POST /refresh` | `{ "refreshToken": "<token>" }` | Validates the refresh token and returns a new token pair. |

### Response Shape

```json
{
  "accessToken": "<jwt expires in 1m>",
  "refreshToken": "<jwt expires in 7d>"
}
```

### Access & Refresh Token Flow

1. Register/Login returns both tokens.
2. Clients use the access token in the `Authorization: Bearer <token>` header for protected endpoints (not included in this sample but expected in downstream modules).
3. When the access token expires (~60s), call `POST /auth/refresh` with the last refresh token.
4. The refresh token is verified via `JwtService.verifyAsync` and matched to the stored user; a fresh pair of tokens is issued and the stored refresh token is updated.

If verification fails or the refresh token is missing/expired, an `UnauthorizedException` (HTTP 401) is returned.

## Configuration Notes

- JWT secret is currently hard-coded as `root` inside `src/auth/auth.module.ts`. Replace this with an environment variable via `JwtModule.registerAsync` before deploying.
- Database credentials are also in code for demonstration purposes; prefer environment variables or a config module in production.

## Testing the Endpoints

Simple curl examples:

```
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"SuperSecure1!"}'

curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"SuperSecure1!"}'

curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh token>"}'
```

## Future Improvements

- Hash and rotate refresh tokens rather than storing plain values.
- Move secrets/database config into `.env` + `ConfigModule`.
- Add guards (e.g., `JwtAuthGuard`) to protect additional routes.
- Write unit/e2e tests covering the auth flow.

## License

MIT
