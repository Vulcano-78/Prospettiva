import { NextRequest, NextResponse, after } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { fulfillOrder, type OrderItem } from '@/lib/order-fulfillment';

export const dynamic = 'force-dynamic';
// Stripe richiede il body RAW per verificare la firma — disabilita parsing automatico.
export const runtime = 'nodejs';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

function ordersFromMetadata(metadata: Stripe.Metadata): OrderItem[] {
  const count = parseInt(metadata.items_count ?? '0', 10);
  const items: OrderItem[] = [];
  for (let i = 0; i < count; i++) {
    const raw = metadata[`item_${i}`];
    if (!raw) continue;
    try {
      items.push(JSON.parse(raw));
    } catch {
      // item corrotto: salto. Il fulfillment proseguirà sugli altri.
    }
  }
  return items;
}

/**
 * Stripe webhook handler. Sorgente autoritativa per il fulfillment.
 *
 * Eventi gestiti:
 *  - payment_intent.succeeded: crea ordine + fa partire webhook n8n
 *  - payment_intent.payment_failed: log (per ora niente azione, lo lasciamo a Stripe)
 *
 * Idempotenza: garantita dalla UNIQUE constraint su orders.stripe_payment_intent_id.
 * Stripe può rispedire lo stesso evento più volte — il secondo INSERT fallisce
 * silenziosamente (vedi fulfillOrder).
 */
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Webhook non configurato' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Firma mancante' }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Firma non valida';
    console.error('[stripe-webhook] signature verification failed:', message);
    return NextResponse.json({ error: 'Firma non valida' }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent;
    const metadata = pi.metadata ?? {};

    const orders = ordersFromMetadata(metadata);
    if (orders.length === 0) {
      console.error('[stripe-webhook] no items in metadata for', pi.id);
      // Rispondiamo 200 comunque: niente da fare, non ha senso che Stripe riprovi.
      return NextResponse.json({ received: true });
    }

    const supabase = await createClient();

    after(async () => {
      try {
        await fulfillOrder({
          supabase,
          orders,
          email: metadata.email || '',
          emailDocumenti: metadata.email_documenti || '',
          userId: metadata.user_id || null,
          orderRef: metadata.order_ref || '',
          stripePaymentIntentId: pi.id,
        });
      } catch (err) {
        console.error('[stripe-webhook] fulfillOrder failed:', err);
        // Non re-throw: l'after() runtime di Next non gestisce retry comunque,
        // e abbiamo già risposto 200 a Stripe. Stripe ritenta solo se rispondiamo errore.
      }
    });

    return NextResponse.json({ received: true });
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object as Stripe.PaymentIntent;
    console.warn('[stripe-webhook] payment failed:', pi.id, pi.last_payment_error?.message);
    return NextResponse.json({ received: true });
  }

  // Altri eventi: rispondiamo 200 per non far retry inutili.
  return NextResponse.json({ received: true });
}
