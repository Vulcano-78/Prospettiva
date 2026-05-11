import { NextRequest, NextResponse, after } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { fulfillOrder, type OrderItem } from '@/lib/order-fulfillment'

export const dynamic = 'force-dynamic'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

function ordersFromMetadata(metadata: Stripe.Metadata): OrderItem[] {
  const count = parseInt(metadata.items_count ?? '0', 10)
  const items: OrderItem[] = []
  for (let i = 0; i < count; i++) {
    const raw = metadata[`item_${i}`]
    if (!raw) continue
    try {
      items.push(JSON.parse(raw))
    } catch {
      /* skip corrupt item */
    }
  }
  return items
}

/**
 * Endpoint chiamato dal browser dopo il return da Stripe (pagina /conferma).
 *
 * SICUREZZA: richiede sempre un `paymentIntentId` valido. L'ordine viene
 * ricostruito dai metadata del PaymentIntent (server-side, autoritativi),
 * NON dai dati che il browser invierebbe.
 *
 * RELAZIONE CON IL WEBHOOK STRIPE:
 *  - Il path principale è il webhook (/api/stripe-webhook): è autoritativo
 *    e affidabile (firma verificata, retry automatici).
 *  - Questo endpoint è un fallback per il browser, utile per:
 *    a) restituire l'orderRef immediatamente per la UI di conferma
 *    b) gestire la finestra di race tra return Stripe e arrivo del webhook
 *  - Idempotenza: la UNIQUE su stripe_payment_intent_id impedisce doppi insert.
 *    Se chiamato dopo il webhook, ritorna l'orderRef esistente senza side effect.
 */
export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId } = await request.json()

    if (!paymentIntentId || typeof paymentIntentId !== 'string') {
      return NextResponse.json({ error: 'paymentIntentId mancante' }, { status: 400 })
    }

    const stripe = getStripe()
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (pi.status !== 'succeeded') {
      return NextResponse.json(
        { error: `Pagamento non confermato (stato: ${pi.status})` },
        { status: 402 }
      )
    }

    const metadata = pi.metadata ?? {}
    const orders = ordersFromMetadata(metadata)
    if (orders.length === 0) {
      return NextResponse.json({ error: 'Ordine non trovato nei metadata' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userIdNow = user?.id ?? null
    // Se l'ordine era stato avviato da guest e l'utente nel frattempo si è loggato,
    // usiamo l'user_id corrente. Altrimenti quello salvato nei metadata.
    const userId = userIdNow || metadata.user_id || null

    const result = await fulfillOrder({
      supabase,
      orders,
      email: metadata.email || '',
      emailDocumenti: metadata.email_documenti || '',
      userId,
      orderRef: metadata.order_ref || '',
      stripePaymentIntentId: pi.id,
    })

    // Se l'ordine era già stato fulfillato dal webhook e nel frattempo l'utente
    // si è loggato, associo la riga al suo user_id (best-effort).
    if (!result.inserted && userIdNow && !metadata.user_id) {
      after(async () => {
        await supabase
          .from('orders')
          .update({ user_id: userIdNow })
          .eq('stripe_payment_intent_id', pi.id)
          .is('user_id', null)
      })
    }

    return NextResponse.json({
      orderRef: result.orderRef,
      saved: !!userId,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Errore interno'
    console.error('[process-order] failed:', message)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
