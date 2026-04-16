import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const { amount, items } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Importo non valido' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        items: JSON.stringify(items.map((i: { name: string; price: number }) => ({
          name: i.name,
          price: i.price,
        }))),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Errore interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
