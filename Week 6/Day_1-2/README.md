```markdown
# NestJS Ecommerce Backend (MongoDB / Mongoose)

This repository is a starter NestJS backend implementing the MongoDB/Mongoose schemas you provided, plus DTOs, controllers, services, and guards (JWT and roles). It includes core modules:

- Auth (JWT)
- Users
- Products & ProductVariants
- Cart
- Orders
- Promotions & Coupons (basic)
- Shipping & SavedFilters (schemata included)
- Utilities: guards, decorators, DTOs

Notes:
- The code uses Mongoose and Passport JWT.
- You must set environment variables (see `.env.example`).
- Some business logic (payment provider integration, complex promotion stacking) is stubbed and marked TODO.
- Checkout uses a MongoDB transaction when possible.

To run:
1. Copy `.env.example` to `.env` and set MONGODB_URI and JWT_SECRET.
2. npm install
3. npm run start:dev

This is a functional starting point — if you want more endpoints, integration tests, or swagger docs next, I can add them.
```