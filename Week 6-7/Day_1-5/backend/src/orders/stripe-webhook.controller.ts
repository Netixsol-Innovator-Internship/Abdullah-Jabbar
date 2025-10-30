
import {
  Controller,
  Post,
  Req,
  Res,
  Body,
  Headers,
  HttpCode,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { OrdersService } from './orders.service';

@Controller('webhooks')
export class StripeWebhookController {
  private logger = new Logger(StripeWebhookController.name);

  constructor(
    private stripeService: StripeService,
    private ordersService: OrdersService,
  ) {}

  // Raw body is required to verify signature. Ensure express.json raw middleware applied in main.ts if necessary.
  @Post('stripe')
  @HttpCode(200)
  async handle(@Req() req: Request, @Res() res: Response, @Headers() headers) {
    const sig = headers['stripe-signature'] as string;
    // Use STRIPE_WEBHOOK_SECRET for webhook verification (more secure than the main secret key)
    const secret =
      process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_SECRET_KEY || '';

    // Stripe webhook received

    try {
      let event: any;

      // In development, if webhook secret is the default placeholder, skip verification
      const isDevelopment =
        process.env.NODE_ENV !== 'production' &&
        secret === 'whsec_test_your_webhook_secret_here';

      if (isDevelopment) {
        // Development mode: skip signature verification
        event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      } else {
        event = this.stripeService.constructEvent(req.body, sig, secret);
      }

      this.logger.debug(`Received stripe event: ${event.type}`);

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as any;
          // Checkout session completed

          // Update order by paymentSessionId and capture payment method details
          const result =
            await this.ordersService.handlePaymentSuccessWithDetails(
              session.id,
              session.payment_status,
              session.payment_intent,
            );

          // Order creation result processed
          break;
        }
        case 'payment_intent.succeeded': {
          const pi = event.data.object as any;
          // payment intent succeeded
          await this.ordersService.handlePaymentIntentSucceeded(
            pi.id,
            pi.status,
          );
          break;
        }
        case 'payment_intent.payment_failed': {
          const pi = event.data.object as any;
          // payment intent failed
          await this.ordersService.handlePaymentIntentFailed(pi.id, pi.status);
          break;
        }
        default:
          this.logger.debug(`Unhandled stripe event ${event.type}`);
        // unhandled event
      }

      res.send({ received: true });
    } catch (err) {
      this.logger.error('Stripe webhook error', err as any);
      console.error('Stripe webhook error:', err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
