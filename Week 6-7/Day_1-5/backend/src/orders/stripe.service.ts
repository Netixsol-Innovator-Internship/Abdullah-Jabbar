
import Stripe from 'stripe';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private logger = new Logger(StripeService.name);

  constructor() {
    const key = process.env.STRIPE_SECRET_KEY || '';
    this.stripe = new Stripe(key, { apiVersion: '2022-11-15' } as any);
  }

  // Method to get Stripe instance for advanced operations
  getStripeInstance(): Stripe {
    return this.stripe;
  }

  async createCheckoutSession({
    lineItems,
    successUrl,
    cancelUrl,
    metadata,
    customerEmail,
  }: {
    lineItems: Array<any>;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, any>;
    customerEmail?: string;
  }) {
    this.logger.debug('Creating stripe checkout session');

    const sessionConfig: any = {
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_intent_data: { metadata },
    };

    // If customer email is provided, pre-fill and lock it
    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
      sessionConfig.customer_creation = 'if_required'; // Creates customer if doesn't exist
      this.logger.debug(
        'Customer email configured for checkout:',
        customerEmail,
      );
    }

    const session = await this.stripe.checkout.sessions.create(sessionConfig);
    return session;
  }

  constructEvent(payload: Buffer, sig: string, secret: string) {
    try {
      return this.stripe.webhooks.constructEvent(payload, sig, secret);
    } catch (err) {
      this.logger.error('Failed to construct stripe event', err as any);
      throw err;
    }
  }

  // Create a payment intent for custom forms
  async createPaymentIntent({
    amount,
    currency = 'usd',
    metadata,
    customerEmail,
  }: {
    amount: number;
    currency?: string;
    metadata?: Record<string, any>;
    customerEmail?: string;
  }) {
    this.logger.debug('Creating payment intent');
    return await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }

  // Confirm a payment intent
  async confirmPaymentIntent(paymentIntentId: string) {
    this.logger.debug('Confirming payment intent:', paymentIntentId);
    return await this.stripe.paymentIntents.confirm(paymentIntentId);
  }
}
