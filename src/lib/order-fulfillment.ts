// Fulfillment di un ordine pagato: INSERT in `orders` + invio webhook n8n.
// Chiamato sia dal webhook Stripe (path autoritativo, server-side) sia da
// /api/process-order (chiamata dal browser dopo la redirect Stripe).
// L'idempotenza è garantita dalla UNIQUE constraint su stripe_payment_intent_id.

import type { SupabaseClient } from '@supabase/supabase-js'
import { buildTipoServizioLabel } from '@/lib/tipo-servizio-label'

export type OrderItem = { slug: string; formData: Record<string, string> }

function post(url: string, payload: unknown): Promise<void> {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(() => {}).catch(() => {})
}

function buildVisuraPayload(
  order: OrderItem,
  email: string,
  emailDocumenti: string | undefined,
  userId: string | null,
  orderRef: string,
  dataRichiestaIso: string
) {
  const fd = order.formData
  const searchType = fd._searchType || 'immobile'
  const tipoVisura = order.slug === 'visura-catastale-storica' ? 'storica' : 'ordinaria'
  const base: Record<string, string> = {
    tipo_catasto: fd.tipo_catasto || 'F',
    tipo_visura: tipoVisura,
    tipo_dettaglio: fd.tipo_dettaglio || 'sintetica',
    tipo_servizio_label: buildTipoServizioLabel(order),
    data_richiesta_iso: dataRichiestaIso,
    email,
    order_ref: orderRef,
  }
  if (emailDocumenti) base.email_documenti = emailDocumenti
  if (userId) base.user_id = userId

  if (searchType === 'immobile') {
    const payload: Record<string, string> = {
      entita: 'immobile',
      provincia: (fd.provincia || '').toUpperCase(),
      comune: (fd.comune || '').toUpperCase(),
      foglio: fd.foglio || '',
      particella: fd.particella || '',
      ...base,
    }
    if (fd.subalterno) payload.subalterno = fd.subalterno
    return payload
  }

  return {
    entita: 'soggetto',
    cf_piva: fd.cf_piva || '',
    provincia: (fd.provincia || '').toUpperCase(),
    ...base,
  }
}

export async function fireN8nWebhooks(
  orders: OrderItem[],
  email: string,
  emailDocumenti: string,
  userId: string | null,
  orderRef: string
): Promise<void> {
  const slugToTipoServizio: Record<string, string> = {
    'prospetto-catastale': 'prospetto_catastale',
    'ricerca-persona': 'ricerca_persona',
    'ricerca-nazionale': 'ricerca_nazionale',
    'ricerca-indirizzo': 'ricerca_indirizzo',
  }

  const promises: Promise<void>[] = []
  const dataRichiestaIso = new Date().toISOString()

  for (const order of orders) {
    const fd = order.formData
    const base: Record<string, string> = {
      order_ref: orderRef,
      tipo_servizio_label: buildTipoServizioLabel(order),
      data_richiesta_iso: dataRichiestaIso,
      ...(userId ? { user_id: userId } : {}),
    }

    if (order.slug === 'estratto-mappa') {
      const payload: Record<string, string> = {
        provincia: (fd.provincia || '').toUpperCase(),
        comune: (fd.comune || '').toUpperCase(),
        foglio: fd.foglio || '',
        particella: fd.particella || '',
        email,
        ...base,
      }
      if (fd.sezione) payload.sezione = fd.sezione
      promises.push(post('https://n8n.vulcano.tools/webhook-test/estratto-mappa', payload))
    }

    if (order.slug === 'elaborato-planimetrico') {
      const payload: Record<string, string> = {
        provincia: (fd.provincia || '').toUpperCase(),
        comune: (fd.comune || '').toUpperCase(),
        foglio: fd.foglio || '',
        particella: fd.particella || '',
        email,
        ...base,
      }
      if (fd.sezione) payload.sezione = fd.sezione
      promises.push(post('https://n8n.vulcano.tools/webhook/elaborato-planimetrico', payload))
    }

    if (order.slug in slugToTipoServizio) {
      const tipo_servizio = slugToTipoServizio[order.slug]
      const payload: Record<string, string> = { tipo_servizio, email, ...base }
      payload.tipo_catasto = fd.tipo_catasto || 'F'
      if (fd.provincia) payload.provincia = fd.provincia.toUpperCase()
      if (fd.comune) payload.comune = fd.comune.toUpperCase()
      if (fd.foglio) payload.foglio = fd.foglio
      if (fd.particella) payload.particella = fd.particella
      if (fd.subalterno) payload.subalterno = fd.subalterno
      if (fd.cf_piva) payload.cf_piva = fd.cf_piva
      if (fd.indirizzo) payload.indirizzo = fd.indirizzo
      promises.push(post('https://n8n.vulcano.tools/webhook/richiesta-catastale', payload))
    }

    if (order.slug === 'visura-catastale' || order.slug === 'visura-catastale-storica') {
      const payload = buildVisuraPayload(order, email, emailDocumenti || undefined, userId, orderRef, dataRichiestaIso)
      const searchType = fd._searchType || 'immobile'
      const tipoVisura = order.slug === 'visura-catastale-storica' ? 'storica' : 'ordinaria'
      const tipoEntita = (searchType === 'soggetto' || searchType === 'soggetto-giuridico') ? 'soggetto' : 'immobile'
      const url = `https://n8n.vulcano.tools/webhook/visura-catastale-${tipoEntita}-${tipoVisura}`
      promises.push(post(url, payload))
    }

    if (order.slug === 'ispezione-ipotecaria-nazionale') {
      promises.push(post('https://n8n.vulcano.tools/webhook/ispezione-ipotecaria-nazionale', {
        cf_piva: fd.cf_piva || '',
        email,
        ...base,
      }))
    }

    if (order.slug === 'ispezione-ipotecaria') {
      const mode = fd._mode || 'immobile'
      if (mode === 'soggetto' || mode === 'soggetto-giuridico') {
        promises.push(post('https://n8n.vulcano.tools/webhook/ispezione-ipotecaria-soggetto', {
          conservatoria: fd.conservatoria || '',
          cf_piva: fd.cf_piva || '',
          tipo_soggetto: mode === 'soggetto-giuridico' ? 'giuridico' : 'fisico',
          email,
          ...base,
        }))
      } else {
        const payload: Record<string, string | number> = {
          conservatoria: fd.conservatoria || '',
          comune: (fd.comune || '').toUpperCase(),
          tipo_catasto: fd.tipo_catasto || 'F',
          foglio: Number(fd.foglio) || 0,
          particella: Number(fd.particella) || 0,
          email,
          ...base,
        }
        if (fd.subalterno) payload.subalterno = Number(fd.subalterno)
        promises.push(post('https://n8n.vulcano.tools/webhook/ispezione-ipotecaria-immobile', payload))
      }
    }

    if (order.slug === 'elenco-note-ipotecarie') {
      const mode = fd._mode || 'soggetto'
      const tipoRegistro = fd.tipo_registro || 'generale'
      if (mode === 'soggetto' || mode === 'soggetto-giuridico') {
        const payload: Record<string, string | number> = {
          tipo_restrizione: 'soggetto',
          tipo_registro: tipoRegistro,
          conservatoria: fd.conservatoria || '',
          anno: Number(fd.anno) || 0,
          cf_piva: (fd.cf_piva || '').toUpperCase(),
          email,
          ...base,
        }
        if (tipoRegistro === 'particolare') {
          payload.registro_particolare = Number(fd.registro_particolare) || 0
          payload.tipo_nota = fd.tipo_nota || ''
        } else {
          payload.registro_generale = Number(fd.registro_generale) || 0
        }
        promises.push(post('https://n8n.vulcano.tools/webhook/ispezione-ipotecaria-singola-nota-soggetto', payload))
      } else {
        const payload: Record<string, string | number> = {
          tipo_restrizione: 'immobile',
          tipo_registro: tipoRegistro,
          conservatoria: fd.conservatoria || '',
          anno: Number(fd.anno) || 0,
          comune: (fd.comune || '').toUpperCase(),
          tipo_catasto: fd.tipo_catasto || 'F',
          foglio: Number(fd.foglio) || 0,
          particella: Number(fd.particella) || 0,
          email,
          ...base,
        }
        if (tipoRegistro === 'particolare') {
          payload.registro_particolare = Number(fd.registro_particolare) || 0
          payload.tipo_nota = fd.tipo_nota || ''
        } else {
          payload.registro_generale = Number(fd.registro_generale) || 0
        }
        if (fd.subalterno) payload.subalterno = Number(fd.subalterno)
        promises.push(post('https://n8n.vulcano.tools/webhook/ispezione-ipotecaria-singola-nota-immobile', payload))
      }
    }
  }

  await Promise.all(promises)
}

export type FulfillInput = {
  supabase: SupabaseClient
  orders: OrderItem[]
  email: string
  emailDocumenti: string
  userId: string | null
  orderRef: string
  stripePaymentIntentId: string
}

export type FulfillResult = {
  inserted: boolean // false se l'ordine era già stato fulfillato (duplicate)
  orderRef: string
}

/**
 * Esegue il fulfillment idempotente: prova INSERT in `orders` con stripe_payment_intent_id
 * come UNIQUE. Se l'INSERT riesce, fa partire i webhook n8n. Se è già esistente
 * (duplicate key), considera l'operazione già completata e non fa nulla.
 *
 * Ritorna l'orderRef esistente (non quello passato in input) se l'ordine era già lì,
 * così il chiamante può fare lookup consistente.
 */
export async function fulfillOrder(input: FulfillInput): Promise<FulfillResult> {
  const { supabase, orders, email, emailDocumenti, userId, orderRef, stripePaymentIntentId } = input

  const enrichedItems = orders.map(o => ({
    ...o,
    tipo_servizio_label: buildTipoServizioLabel(o),
  }))

  // Tenta l'INSERT. La UNIQUE su stripe_payment_intent_id previene duplicati.
  const { data: inserted, error: insertError } = await supabase
    .from('orders')
    .insert({
      order_ref: orderRef,
      email,
      user_id: userId,
      items: enrichedItems,
      stripe_payment_intent_id: stripePaymentIntentId,
    })
    .select('order_ref')
    .single()

  if (insertError) {
    // Postgres error 23505 = unique_violation. L'ordine era già stato fulfillato.
    if (insertError.code === '23505') {
      const { data: existing } = await supabase
        .from('orders')
        .select('order_ref')
        .eq('stripe_payment_intent_id', stripePaymentIntentId)
        .single()
      return { inserted: false, orderRef: existing?.order_ref ?? orderRef }
    }
    // Altro errore: non sappiamo lo stato. Rilancia per far retry a Stripe.
    throw new Error(`fulfillOrder insert failed: ${insertError.message}`)
  }

  // INSERT riuscito → spariamo i webhook n8n una sola volta.
  await fireN8nWebhooks(orders, email, emailDocumenti, userId, inserted.order_ref)

  return { inserted: true, orderRef: inserted.order_ref }
}

export function generateOrderRef(): string {
  return `PRSP-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${new Date().getFullYear()}`
}
