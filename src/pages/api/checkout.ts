import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { z } from 'zod';
import { PRODUCT_CONFIG } from '../../config/product';

const STRIPE_SECRET_KEY = import.meta.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.warn('⚠️ STRIPE_SECRET_KEY is missing from environment variables.');
}

const stripe = new Stripe(STRIPE_SECRET_KEY || '');

const CheckoutSchema = z.object({
  priceId: z.string().optional(),
});

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const body = await request.json();
    const result = CheckoutSchema.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Invalid request data' }), { status: 400 });
    }

    const siteUrl = url.origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: PRODUCT_CONFIG.currency,
            product_data: {
              name: PRODUCT_CONFIG.name,
              description: PRODUCT_CONFIG.description,
              images: [PRODUCT_CONFIG.imageUrl],
            },
            unit_amount: PRODUCT_CONFIG.priceInSoles * 100, // Stripe expects amount in cents/centimos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?canceled=true`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
