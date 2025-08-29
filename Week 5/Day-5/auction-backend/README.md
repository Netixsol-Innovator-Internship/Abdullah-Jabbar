# API Documentation

## Authentication

```http
POST http://localhost:4000/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "fullName": "string",
  "mobileNumber": "string",
  "password": "string (min 6 characters)"
}
```

Example register request:
```http
POST http://localhost:4000/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "mobileNumber": "+1234567890",
  "password": "secure123password"
}
```

```http
POST http://localhost:4000/auth/login
Content-Type: application/json

{
  "identifier": "string", // can be username or email
  "password": "string"
}
```

Example login request:
```http
POST http://localhost:4000/auth/login
Content-Type: application/json

{
  "identifier": "johndoe",  // or "john@example.com"
  "password": "secure123password"
}
```

## Users

```http
GET http://localhost:4000/users
Authorization: Bearer <token>
```

```http
GET http://localhost:4000/users/:id
Authorization: Bearer <token>
```

## Cars / Auctions  

```http
POST http://localhost:4000/cars
Authorization: Bearer <token>
Content-Type: application/json

{
  "sellerId": "mongoDbId",
  "title": "string",
  "make": "string",
  "model": "string",
  "year": 2023,  // must be >= 1900
  "bodyType": "sedan",  // must be one of: sedan, sports, hatchback, convertible
  "description": "string",
  "startingPrice": 1000,  // must be a number
  "photos": ["string"],   // array of photo URLs
  "category": "string",
  "startTime": "2023-08-29T12:00:00Z",  // ISO date string
  "endTime": "2023-08-30T12:00:00Z"     // ISO date string
}
```

Example request:
```http
POST http://localhost:4000/cars
Authorization: Bearer <token>
Content-Type: application/json

{
  "sellerId": "64ed403d8fef11c19489a0bc",
  "title": "2023 Toyota Camry Sedan",
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "bodyType": "sedan",
  "description": "Well maintained Toyota Camry",
  "startingPrice": 25000,
  "photos": ["https://example.com/car-image.jpg"],
  "category": "luxury",
  "startTime": "2023-08-29T12:00:00Z",
  "endTime": "2023-08-30T12:00:00Z"
}
```

```http
GET http://localhost:4000/cars
Authorization: Bearer <token>
```

```http
GET http://localhost:4000/cars/:id
Authorization: Bearer <token>
```

## Bids

```http
POST http://localhost:4000/bids
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": "number",
  "auctionId": "string",
  "userId": "string"
}
```

Example bid request:
```http
POST http://localhost:4000/bids
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "amount": 26000,
  "auctionId": "64ed403d8fef11c19489a0bc",
  "userId": "64ed403d8fef11c19489a0bd"
}
```

```http
GET http://localhost:4000/bids
Authorization: Bearer <token>
```

Example bids list request:
```http
GET http://localhost:4000/bids
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

```http
GET http://localhost:4000/bids/:id
Authorization: Bearer <token>
```

Example get specific bid:
```http
GET http://localhost:4000/bids/64ed403d8fef11c19489a0bc
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Payments

```http
POST http://localhost:4000/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": "number",
  "auctionId": "string",
  "userId": "string",
  "paymentMethod": "string"
}
```

Example payment request:
```http
POST http://localhost:4000/payments
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "amount": 26000,
  "auctionId": "64ed403d8fef11c19489a0bc",
  "userId": "64ed403d8fef11c19489a0bd",
  "paymentMethod": "credit_card"
}
```

```http
GET http://localhost:4000/payments
Authorization: Bearer <token>
```

Example payments list request:
```http
GET http://localhost:4000/payments
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

```http
GET http://localhost:4000/payments/:id
Authorization: Bearer <token>
```

Example get specific payment:
```http
GET http://localhost:4000/payments/64ed403d8fef11c19489a0bc
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Wishlist

```http
POST http://localhost:4000/wishlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "auctionId": "string",
  "userId": "string"
}
```

Example wishlist add request:
```http
POST http://localhost:4000/wishlist
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "auctionId": "64ed403d8fef11c19489a0bc",
  "userId": "64ed403d8fef11c19489a0bd"
}
```

```http
GET http://localhost:4000/wishlist
Authorization: Bearer <token>
```

Example wishlist items request:
```http
GET http://localhost:4000/wishlist
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

```http
GET http://localhost:4000/wishlist/:id
Authorization: Bearer <token>
```

Example get specific wishlist item:
```http
GET http://localhost:4000/wishlist/64ed403d8fef11c19489a0bc
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Categories

```http
POST http://localhost:4000/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "description": "string"
}
```

Example category creation:
```http
POST http://localhost:4000/categories
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Luxury Cars",
  "description": "High-end luxury automobiles"
}
```

```http
GET http://localhost:4000/categories
Authorization: Bearer <token>
```

Example categories list request:
```http
GET http://localhost:4000/categories
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

```http
GET http://localhost:4000/categories/:id
Authorization: Bearer <token>
```

Example get specific category:
```http
GET http://localhost:4000/categories/64ed403d8fef11c19489a0bc
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Socket.IO Events

### Client Events

```typescript
joinRoom (payload: { auctionId: string })
bidPlaced (payload: { auctionId: string, amount: number, userId: string })
```

### Server Events

```typescript
bidReceived (payload: { bid: Bid })
auctionUpdated (payload: { auction: Auction })
```

Note: All protected routes require a valid JWT token in the Authorization header.