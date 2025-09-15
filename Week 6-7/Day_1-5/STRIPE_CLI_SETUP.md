# Stripe CLI Setup for Local Development

## Installation
1. Download Stripe CLI from: https://stripe.com/docs/stripe-cli
2. Install and login: `stripe login`

## Forward webhooks to your local server
```bash
stripe listen --forward-to localhost:3001/webhooks/stripe
```

This will:
- Create a webhook endpoint that forwards to your local server
- Provide you with a webhook signing secret
- Forward all Stripe events to your local development server

## Add the webhook secret to your environment
Copy the webhook signing secret from the CLI output and add to your .env file:
```
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...
```

## Test payments
Once the CLI is running, any test payments made through your application will automatically trigger the webhook and create orders in your database.

## Events to listen for
The application listens for: `checkout.session.completed`
