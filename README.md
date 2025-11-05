<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Key features (Ecommerce Backend)

- Authentication and Authorization
  - JWT-based auth with Passport (Bearer scheme `JWT`)
  - Config-driven secrets and expiry (`jwt.secret`, `jwt.expiresIn`)
  - Guarded routes via `JwtAuthGuard`
  - Typed `CurrentUser` injection from validated JWT
- User management
  - Register, Login, Update Password flows
  - Prisma ORM with a normalized `User` model
  - Account flags: `isActive`, `isVerified`, `lastLoginAt`
- Product management
  - Full CRUD operations for products
  - Product images, variants, and attributes support
  - Category-based product organization
  - Inventory tracking with low stock thresholds
  - Product status workflow (DRAFT, PUBLISHED, ARCHIVED, OUT_OF_STOCK)
  - SEO metadata support (meta title, meta description)
  - Search and filtering capabilities
  - Pagination support for product listings
- API documentation
  - Swagger UI at `/api`
  - Named security scheme `JWT` for protected endpoints
- Configuration
  - `@nestjs/config` with modular factories: `app`, `jwt`, `database`
  - `.env`-driven with examples in `.env.example`
- Tooling
  - ESLint/Prettier setup, Jest unit/e2e scaffolding
  - Docker compose for Postgres

## Environment configuration

Required keys (via `.env` or environment):

```
JWT_SECRET=your-strong-secret
JWT_EXPIRES_IN=7d
# When running locally (outside Docker), use port 5433 (mapped from Docker)
DATABASE_URL=postgresql://ecommerce_user:ecommerce_password@localhost:5433/ecommerce_dev?schema=public
# When running in Docker, use: postgresql://ecommerce_user:ecommerce_password@postgres:5432/ecommerce_dev?schema=public
APP_PORT=3000
NODE_ENV=development
```

These are loaded by `ConfigModule.forRoot({ load })` through factory files in `src/config`:
- `app.config.ts` => `app.port`, `app.env`
- `jwt.config.ts` => `jwt.secret`, `jwt.expiresIn`
- `database.config.ts` => `database.url`

## Auth API

Base URL: `http://localhost:3000`

- Swagger UI: `http://localhost:3000/api`
- Auth scheme: HTTP Bearer JWT (name: `JWT`)

### Register
- POST `/auth/register`
- Body:
```json
{
  "email": "john@example.com",
  "password": "StrongP@ssw0rd",
  "username": "johnny",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-111-222-3333"
}
```
- 201: `{ user, accessToken }`
- 409: user exists

### Login
- POST `/auth/login`
- Body:
```json
{ "email": "john@example.com", "password": "StrongP@ssw0rd" }
```
- 200: `{ user, accessToken }`
- 401: invalid credentials / not active / not verified

### Update password (protected)
- PUT `/auth/password`
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{ "currentPassword": "OldP@ss", "newPassword": "NewStr0ngP@ss" }
```
- 200: `{ "message": "Password updated successfully" }`
- 401/403 on invalid token or user context

### JWT payload
```
{ sub: string; email: string; role: string }
```

### Quick test via Swagger
1. Register ➜ copy `accessToken`
2. Click Authorize in `/api`, choose `JWT`, paste token (raw)
3. Call PUT `/auth/password`

## Product API

Base URL: `http://localhost:3000`

### Get all products
- GET `/products`
- Query parameters:
  - `page` (optional, default: 1) - Page number
  - `limit` (optional, default: 10) - Items per page
  - `categoryId` (optional) - Filter by category ID
  - `status` (optional) - Filter by status: `DRAFT`, `PUBLISHED`, `ARCHIVED`, `OUT_OF_STOCK`
  - `isActive` (optional, boolean) - Filter by active status
  - `isFeatured` (optional, boolean) - Filter by featured status
  - `search` (optional) - Search in name, description, slug, or SKU
- 200: `{ products: ProductResponseDto[], total: number, page: number, limit: number }`
- Public endpoint (no authentication required)

### Get product by ID
- GET `/products/:id`
- 200: `ProductResponseDto`
- 404: Product not found
- Public endpoint (no authentication required)

### Get product by slug
- GET `/products/slug/:slug`
- 200: `ProductResponseDto`
- 404: Product not found
- Public endpoint (no authentication required)

### Get products by category
- GET `/products/category/:categoryId`
- Query parameters:
  - `page` (optional, default: 1) - Page number
  - `limit` (optional, default: 10) - Items per page
- 200: `{ products: ProductResponseDto[], total: number, page: number, limit: number }`
- 404: Category not found
- Public endpoint (no authentication required)

### Create product (protected)
- POST `/products`
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
  "name": "Premium Cotton T-Shirt",
  "slug": "premium-cotton-t-shirt",
  "description": "A premium quality cotton t-shirt perfect for everyday wear.",
  "shortDescription": "Premium cotton t-shirt",
  "price": "29.99",
  "comparePrice": "39.99",
  "costPrice": "15.00",
  "categoryId": "clx1234567890abcdef",
  "sku": "PROD-001",
  "barcode": "1234567890123",
  "trackQuantity": true,
  "quantity": 100,
  "lowStockThreshold": 5,
  "weight": "0.5",
  "dimensions": { "length": 30, "width": 25, "height": 5 },
  "material": "100% Cotton",
  "brand": "BrandName",
  "status": "DRAFT",
  "isActive": true,
  "isDigital": false,
  "isFeatured": false,
  "metaTitle": "Premium Cotton T-Shirt - BrandName",
  "metaDescription": "Shop premium cotton t-shirts online.",
  "images": [
    {
      "url": "https://example.com/product-image.jpg",
      "alt": "Product main image",
      "sortOrder": 0,
      "isPrimary": true
    }
  ],
  "variants": [
    {
      "name": "Red - Large",
      "sku": "PROD-001-RED-L",
      "price": "29.99",
      "quantity": 50,
      "attributes": { "color": "red", "size": "large" },
      "isActive": true
    }
  ],
  "attributes": [
    {
      "name": "Color",
      "value": "Red",
      "sortOrder": 0
    }
  ]
}
```
- 201: `ProductResponseDto`
- 400: Invalid input data
- 404: Category not found
- 409: Product with slug, SKU, or barcode already exists

### Update product (protected)
- PUT `/products/:id`
- Headers: `Authorization: Bearer <token>`
- Body: Same as create, but all fields are optional (except slug cannot be updated)
- 200: `ProductResponseDto`
- 404: Product not found
- 409: Product with SKU or barcode already exists

### Delete product (protected)
- DELETE `/products/:id`
- Headers: `Authorization: Bearer <token>`
- 200: `{ "message": "Product archived successfully" }`
- 404: Product not found
- Note: This performs a soft delete by setting status to `ARCHIVED` and `isActive` to `false`

### Update product status (protected)
- PATCH `/products/:id/status`
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
  "status": "PUBLISHED"
}
```
- Valid statuses: `DRAFT`, `PUBLISHED`, `ARCHIVED`, `OUT_OF_STOCK`
- 200: `ProductResponseDto`
- 404: Product not found
- Note: Setting status to `PUBLISHED` automatically sets `publishedAt` timestamp

### Update product quantity (protected)
- PATCH `/products/:id/quantity`
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
  "quantity": 150
}
```
- 200: `ProductResponseDto`
- 400: Invalid quantity (must be >= 0)
- 404: Product not found
- Note: Automatically updates status to `OUT_OF_STOCK` if quantity is 0, or to `PUBLISHED` if quantity > 0 and previous status was `OUT_OF_STOCK`

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
