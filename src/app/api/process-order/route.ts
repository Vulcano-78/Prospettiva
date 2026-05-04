import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type OrderItem = { slug: string; formData: Record<string, string> }

function buildVisuraPayload(
  order: OrderItem,
  email: string,
  emailDocumenti: string | undefined,
  userId: string | null
) {
  const fd = order.formData
  const searchType = fd._searchType || 'immobile'
  const tipoVisura = order.slug === 'visura-catastale-storica' ? 'storica' : 'ordinaria'
  const base: Record<string, string> = {
    tipo_catasto: fd.tipo_catasto || 'F',
    tipo_visura: tipoVisura,
    tipo_dettaglio: fd.tipo_dettaglio || 'sintetica',
    email,
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

function post(url: string, payload: unknown) {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {})
}

function fireWebhooks(
  orders: OrderItem[],
  email: string,
  emailDocumenti: string,
  userId: string | null
) {
  const slugToTipoServizio: Record<string, string> = {
    'prospetto-catastale': 'prospetto_catastale',
    'ricerca-persona': 'ricerca_persona',
    'ricerca-nazionale': 'ricerca_nazionale',
    'ricerca-indirizzo': 'ricerca_indirizzo',
  }

  for (const order of orders) {
    const fd = order.formData
    const base: Record<string, string> = userId ? { user_id: userId } : {}

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
      post('https://n8n.vulcano.tools/webhook-test/estratto-mappa', payload)
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
      post('https://n8n.vulcano.tools/webhook/elaborato-planimetrico', payload)
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
      post('https://n8n.vulcano.tools/webhook/richiesta-catastale', payload)
    }

    if (order.slug === 'visura-catastale' || order.slug === 'visura-catastale-storica') {
      const payload = buildVisuraPayload(order, email, emailDocumenti || undefined, userId)
      const searchType = fd._searchType || 'immobile'
      const url = searchType === 'soggetto' || searchType === 'soggetto-giuridico'
        ? 'https://n8n.vulcano.tools/webhook-test/visura-catastale-soggetto'
        : 'https://n8n.vulcano.tools/webhook-test/visura-catastale'
      post(url, payload)
    }

    if (order.slug === 'ispezione-ipotecaria-nazionale') {
      post('https://n8n.vulcano.tools/webhook/ispezione-ipotecaria', {
        cf_piva: fd.cf_piva || '',
        email,
        ...base,
      })
    }

    if (order.slug === 'elenco-note-ipotecarie') {
      const mode = fd._mode || 'immobile'
      if (mode === 'immobile') {
        const payload: Record<string, string | number> = {
          entita: 'ispezione_immobile',
          conservatoria: fd.conservatoria || '',
          comune: (fd.comune || '').toUpperCase(),
          tipo_catasto: fd.tipo_catasto || 'F',
          foglio: Number(fd.foglio) || 0,
          particella: Number(fd.particella) || 0,
          email,
          ...base,
        }
        if (fd.subalterno) payload.subalterno = Number(fd.subalterno)
        if (fd.sezione) payload.sezione = fd.sezione
        if (fd.sezione_urbana) payload.sezione_urbana = fd.sezione_urbana
        post('https://n8n.vulcano.tools/webhook/elenco-note-ipotecarie', payload)
      } else {
        post('https://n8n.vulcano.tools/webhook/elenco-note-ipotecarie', {
          entita: 'ispezione_soggetto',
          conservatoria: fd.conservatoria || '',
          cf_piva: fd.cf_piva || '',
          email,
          ...base,
        })
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { orders, email, emailDocumenti } = await request.json()

    if (!orders || !email) {
      return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id ?? null

    fireWebhooks(orders, email, emailDocumenti ?? '', userId)

    const orderRef = `PRSP-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${new Date().getFullYear()}`

    if (userId) {
      await supabase.from('orders').insert({
        order_ref: orderRef,
        email: user!.email!,
        user_id: userId,
        items: orders,
      })
    }

    return NextResponse.json({ orderRef, saved: !!userId })
  } catch {
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
