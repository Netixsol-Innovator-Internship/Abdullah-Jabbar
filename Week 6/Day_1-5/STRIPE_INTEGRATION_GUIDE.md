# Stripe Payment Integration Setup

This guide explains how to set up and test the Stripe payment integration in the e-commerce application.

## Prerequisites

1. Stripe account (create one at https://stripe.com)
2. Node.js and npm installed
3. Backend and frontend applications running

## Setup Instructions

### 1. Stripe Dashboard Configuration

1. Log in to your Stripe Dashboard
2. Navigate to **Developers > API keys**
3. Copy your **Publishable key** and **Secret key** (use test keys for development)
4. Navigate to **Developers > Webhooks**
5. Click **Add endpoint**
6. Add your webhook URL: `http://localhost:4000/webhooks/stripe` (or your deployed backend URL)
7. Select these events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
8. Copy the **Webhook signing secret**

### 2. Environment Variables

#### Backend (.env)
```env
# Stripe payment gateway
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_test_your_webhook_secret_here

# Frontend origin for redirect URLs
FRONTEND_ORIGIN=http://localhost:3000
```

#### Frontend (.env)
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### 3. Test Payment Flow

#### For Local Development:

1. Start the backend server:
   ```bash
   cd backend
   npm run start:dev
   ```

2. Start the frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Set up local webhook testing with Stripe CLI:
   ```bash
   # Install Stripe CLI
   # Mac: brew install stripe/stripe-cli/stripe
   # Windows: Download from https://github.com/stripe/stripe-cli/releases

   # Login to Stripe
   stripe login

   # Forward events to your local webhook endpoint
   stripe listen --forward-to localhost:4000/webhooks/stripe
   ```

   The CLI will output a webhook secret starting with `whsec_`. Use this as your `STRIPE_WEBHOOK_SECRET`.

#### Testing the Payment Flow:

1. Add products to cart
2. Navigate to `/cart`
3. Click "Checkout"
4. Fill in the checkout form
5. Click "Place Order"
6. You'll be redirected to Stripe Checkout
7. Use test card numbers:
   - **Successful payment**: `4242 4242 4242 4242`
   - **Declined payment**: `4000 0000 0000 0002`
   - Use any future expiry date, any CVC, and any postal code
8. Complete the payment
9. You'll be redirected to the success page

### 4. Test Card Numbers

Stripe provides several test card numbers for different scenarios:

| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Visa - Successful payment |
| 4000 0000 0000 0002 | Visa - Declined payment |
| 4000 0000 0000 9995 | Visa - Insufficient funds |
| 5555 5555 5555 4444 | Mastercard - Successful payment |
| 3782 822463 10005 | American Express - Successful payment |

### 5. Key Features Implemented

#### Frontend:
- Dedicated checkout page (`/checkout`)
- Form validation for shipping address
- Integration with cart state
- Automatic cart clearing on success
- Error handling and user feedback
- Responsive design

#### Backend:
- Stripe Checkout Session creation
- Webhook handling for payment events
- Order status updates
- Support for both authenticated and guest users
- Comprehensive error handling

### 6. Security Considerations

1. **Never expose secret keys**: Only publishable keys should be in frontend code
2. **Webhook verification**: All webhooks are verified using Stripe signatures
3. **Authentication**: Users must be logged in to complete checkout
4. **HTTPS in production**: Always use HTTPS for payment processing

### 7. Production Deployment

1. Replace test keys with live keys
2. Update webhook endpoint URL to production domain
3. Ensure HTTPS is enabled
4. Set `FRONTEND_ORIGIN` to production domain
5. Configure proper CORS settings

### 8. Troubleshooting

#### Common Issues:

1. **Webhook not receiving events**:
   - Check webhook URL is correct
   - Verify webhook secret matches
   - Ensure server is accessible from internet (use ngrok for local testing)

2. **Payment not completing**:
   - Check browser console for errors
   - Verify Stripe keys are correct
   - Check backend logs for API errors

3. **Cart not clearing**:
   - Check success page implementation
   - Verify webhook is updating order status
   - Check authentication state

#### Debugging:

1. Check browser console for frontend errors
2. Check backend logs for API and webhook errors
3. Use Stripe Dashboard events log to see webhook delivery status
4. Test with Stripe CLI for local webhook testing

### 9. API Endpoints

- `POST /orders/checkout` - Create order and Stripe checkout session
- `POST /webhooks/stripe` - Handle Stripe webhook events
- `GET /orders/success` - Order success page (frontend)

### 10. Future Enhancements

- Multiple payment methods (PayPal, Apple Pay, etc.)
- Subscription payments
- Payment method storage for returning customers
- Advanced shipping calculations
- Tax calculations
- Discount codes and coupons
