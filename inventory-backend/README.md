# Inventory Management System — Backend

Express + Sequelize + SQLite API with JWT authentication.

## Run
1. Copy `.env.example` to `.env` and set a strong `JWT_SECRET`.
2. `npm install`
3. `npm run db:sync`
4. `npm run dev` (or `npm start`)

API base: `http://localhost:3000/api`

### Endpoints
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /products`
- `GET /products/summary`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

All product endpoints require a Bearer JWT and are scoped to the logged-in user.
