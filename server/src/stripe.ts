import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export async function createCheckoutSession(params: {
  priceAmount: number;
  currency: string;
  shortcutId: number;
  shortcutTitle: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: params.currency,
        product_data: {
          name: params.shortcutTitle,
          description: 'iOS Shortcut - Instant Download',
        },
        unit_amount: params.priceAmount,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.customerEmail,
    metadata: {
      shortcutId: params.shortcutId.toString(),
    },
  });
}

export { stripe };





