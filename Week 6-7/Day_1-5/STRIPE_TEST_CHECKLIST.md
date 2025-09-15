# Stripe Payment Integration Test Checklist

## ✅ Backend Setup
- [x] Stripe dependency installed and configured
- [x] Environment variables set (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)
- [x] Orders module with Stripe service
- [x] Webhook controller for payment events
- [x] Order creation with payment processing
- [x] Backend server running on port 4000

## ✅ Frontend Setup  
- [x] Stripe publishable key in environment
- [x] Checkout page created at `/checkout`
- [x] Cart page redirects to checkout
- [x] Success page at `/orders/success`
- [x] Frontend server running on port 3000

## 🧪 Test Scenarios

### 1. Basic Checkout Flow
- [ ] Add products to cart
- [ ] Navigate to `/cart`
- [ ] Click "Checkout" button
- [ ] Redirected to `/checkout` page
- [ ] Fill out shipping address form
- [ ] Click "Place Order"
- [ ] Redirected to Stripe Checkout
- [ ] Complete payment with test card (4242 4242 4242 4242)
- [ ] Redirected to success page
- [ ] Cart cleared after successful payment

### 2. Test Cards to Try
- [ ] **Success**: 4242 4242 4242 4242
- [ ] **Declined**: 4000 0000 0000 0002  
- [ ] **Insufficient funds**: 4000 0000 0000 9995
- [ ] **Authentication required**: 4000 0025 0000 3155

### 3. Authentication Flow
- [ ] Guest user can add to cart
- [ ] Guest user must login before checkout
- [ ] Authenticated user can complete checkout
- [ ] User address pre-fills checkout form

### 4. Error Handling
- [ ] Empty cart shows appropriate message
- [ ] Form validation works for required fields
- [ ] Network errors handled gracefully
- [ ] Payment failures redirect back properly

### 5. Webhook Testing
- [ ] Install Stripe CLI for local testing
- [ ] Run: `stripe listen --forward-to localhost:4000/webhooks/stripe`
- [ ] Complete a test payment
- [ ] Check backend logs for webhook events
- [ ] Verify order status updates to "paid"

## 🔧 Development Commands

### Start Servers
```bash
# Backend (Terminal 1)
cd backend
npm run start:dev

# Frontend (Terminal 2)  
cd frontend
npm run dev

# Stripe Webhooks (Terminal 3)
stripe listen --forward-to localhost:4000/webhooks/stripe
```

### Test Stripe Connection
```bash
cd backend
node stripe-test.js
```

## 🌐 URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Cart: http://localhost:3000/cart
- Checkout: http://localhost:3000/checkout
- Success: http://localhost:3000/orders/success

## 🔍 Debugging

### Check Backend Logs
- Order creation logs
- Stripe API calls
- Webhook event processing
- Error messages

### Check Frontend Console
- Cart state updates
- API call responses  
- Redirect behavior
- Error handling

### Check Stripe Dashboard
- Payment events
- Webhook delivery logs
- Customer data
- Transaction details

## ✅ Production Checklist

### Security
- [ ] Use live Stripe keys in production
- [ ] Enable HTTPS for all payment pages
- [ ] Verify webhook signatures
- [ ] Secure environment variables

### Performance
- [ ] Optimize checkout page loading
- [ ] Handle payment processing states
- [ ] Implement retry logic for failed webhooks
- [ ] Cache static assets

### Monitoring
- [ ] Log payment events
- [ ] Monitor webhook delivery
- [ ] Track conversion rates
- [ ] Set up error alerts

## 📞 Support

If you encounter issues:

1. Check the console for error messages
2. Verify environment variables are set correctly
3. Test with different browsers
4. Use Stripe's test mode for safe testing
5. Check Stripe Dashboard for event logs
6. Refer to Stripe documentation: https://stripe.com/docs
