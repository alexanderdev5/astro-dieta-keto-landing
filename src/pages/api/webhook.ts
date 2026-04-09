import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { z } from 'zod';

const STRIPE_SECRET_KEY = import.meta.env.STRIPE_SECRET_KEY;
const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;

if (!STRIPE_SECRET_KEY) console.warn('⚠️ STRIPE_SECRET_KEY is missing');
if (!RESEND_API_KEY) console.warn('⚠️ RESEND_API_KEY is missing');

const stripe = new Stripe(STRIPE_SECRET_KEY || '');
const resend = new Resend(RESEND_API_KEY || '');

// Webhook Secret for local testing (stripe listen) or production
const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

export const POST: APIRoute = async ({ request }) => {
  const signature = request.headers.get('stripe-signature');

  if (!signature || !webhookSecret) {
    return new Response('Missing signature or webhook secret', { status: 400 });
  }

  try {
    // CRITICAL: Get Raw Buffer to verify signature
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buffer, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Zod validation for session data
      const SessionSchema = z.object({
        customer_details: z.object({
          email: z.string().email(),
          name: z.string().nullable(),
        }),
      });

      const validation = SessionSchema.safeParse(session);
      
      if (validation.success) {
        const { email, name } = validation.data.customer_details;
        const ebookId = import.meta.env.GOOGLE_DRIVE_EBOOK_ID;
        const fromEmail = import.meta.env.EMAIL_FROM_ADDRESS;

        // Disparar envío vía Resend
        await resend.emails.send({
          from: fromEmail || 'onboarding@resend.dev',
          to: email,
          subject: '¡Tu Ebook Dieta Keto 2026 está listo!',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
              <h1>¡Gracias por tu compra, ${name || 'Fitness Enthusiast'}!</h1>
              <p>Has dado el primer paso hacia una vida más saludable con el método Keto 2026.</p>
              <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <p>Descarga tu eBook aquí:</p>
                <a href="https://drive.google.com/uc?export=download&id=${ebookId}" 
                   style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                   DESCARGAR EBOOK
                </a>
              </div>
              <p>Si tienes alguna duda, responde a este correo.</p>
              <p>— El Equipo de Dieta Keto</p>
            </div>
          `,
        });

        console.log(`Email sent successfully to ${email}`);
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return new Response(`Webhook Error: ${error.message}`, { status: 500 });
  }
};
