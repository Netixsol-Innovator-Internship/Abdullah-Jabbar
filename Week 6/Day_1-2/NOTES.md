```markdown
Implementation notes & next steps

What I provided:
- A NestJS application wired with Mongoose, implementing the core schemas you defined (User, Product, ProductVariant, Cart, Order, Promotion, Coupon, ShippingMethod, SavedFilter).
- DTOs for authentication and user creation basics.
- Simple Auth module using JWT (login/register/me).
- Guards: JwtAuthGuard (Passport JWT) and RolesGuard + @Roles decorator.
- Products API: list with simple faceted filters, get by slug, create product/variant (admin only).
- Cart API: get/create cart for user or sessionId, add item, update qty, recalc totals.
- Orders API: checkout endpoint that creates an order from a cart using a MongoDB transaction skeleton, plus get order by orderNumber.
- Promotions and Coupons: endpoints to list active promotions and get coupon by code.
- Minimal Shipping & SavedFilters scaffolding.

Important caveats:
- This is a starting point. Payment provider integration (Stripe, PayPal), inventory decrement (ProductVariant stock changes), and loyalty/notification flows are intentionally left as TODO and marked in code. They require project-specific integration details.
- Decimal handling: Mongoose Decimal128 is used; conversion helpers may be needed for precise arithmetic (I used decimal.js in cart service for recompute). Ensure decimal.js is added to package.json if you use it in production.
- Error handling, validation, and tests should be expanded.
- You should add role seeding and admin creation flow in a seeder or admin endpoint.

What I can do next:
- Add Swagger docs.
- Implement variant stock decrement/inventory transactions at checkout.
- Integrate a payment provider mock (Stripe test) and update payment record/state.
- Expand DTOs for products, orders, cart, and promotions for stricter validation.
```
``` 

I created the full NestJS project files above implementing the schemas, DTOs, controllers, services, and guards needed to run the backend. The next step I recommend is to install dependencies, wire environment variables, and run the app; after that I can:

- add payment integration and finalize checkout flow (inventory decrement + payment + loyalty tx),
- provide Swagger/OpenAPI documentation,
- or scaffold tests and CI.

Which of those would you like me to implement next?