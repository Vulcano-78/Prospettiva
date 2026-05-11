import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServiceBySlug } from '@/data/services';
import { createClient } from '@/lib/supabase/server';
import { generateOrderRef, type OrderItem } from '@/lib/order-fulfillment';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export const dynamic = 'force-dynamic';

/**
 * Crea un PaymentIntent Stripe. Il totale viene SEMPRE ricalcolato server-side
 * dai prezzi in services.ts. Il client NON può influenzare l'importo.
 *
 * Tutti i dati necessari al fulfillment vengono salvati nei metadata del
 * PaymentIntent (max 50 chiavi, 500 char per valore). Il fulfillment vero
 * (insert orders + webhook n8n) avviene nel webhook Stripe / process-order.
 */
export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const body = await request.json();
    const orders: OrderItem[] = body.orders ?? [];
    const email: string = body.email ?? '';
    const emailDocumenti: string = body.emailDocumenti ?? '';

    if (!Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json({ error: 'Carrello vuoto' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email mancante o non valida' }, { status: 400 });
    }

    // Lookup prezzi dal catalogo canonico. Slug sconosciuti rifiutati.
    let totalEur = 0;
    for (const o of orders) {
      const service = getServiceBySlug(o.slug);
      if (!service) {
        return NextResponse.json({ error: `Servizio sconosciuto: ${o.slug}` }, { status: 400 });
      }
      if (!service.isActive) {
        return NextResponse.json({ error: `Servizio non disponibile: ${o.slug}` }, { status: 400 });
      }
      totalEur += service.price;
    }

    if (totalEur <= 0) {
      return NextResponse.json({ error: 'Totale ordine non valido' }, { status: 400 });
    }

    // Identifico utente loggato se presente.
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id ?? null;

    const orderRef = generateOrderRef();

    // Metadata Stripe: split per stare sotto 500 char/key.
    // items_count + item_0, item_1, ... permette di ricostruire orders nel webhook.
    const metadata: Record<string, string> = {
      order_ref: orderRef,
      email,
      email_documenti: emailDocumenti,
      user_id: userId ?? '',
      items_count: String(orders.length),
    };
    orders.forEach((o, i) => {
      metadata[`item_${i}`] = JSON.stringify(o);
    });

    // Verifica difensiva: nessun valore di metadata deve superare 500 char.
    for (const [k, v] of Object.entries(metadata)) {
      if (v.length > 500) {
        return NextResponse.json(
          { error: `Metadata troppo grande (${k}). Riduci il numero di item per ordine.` },
          { status: 400 }
        );
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalEur * 100),
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderRef,
      amount: totalEur,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Errore interno';
    console.error('[create-payment-intent] failed:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
