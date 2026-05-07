import { NextRequest, NextResponse, after } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type OrderItem = { slug: string; formData: Record<string, string> }

function buildVisuraPayload(
  order: OrderItem,
  email: string,
  emailDocumenti: string | undefined,
  userId: string | null,
  orderRef: string
) {
  const fd = order.formData
  const searchType = fd._searchType || 'immobile'
  const tipoVisura = order.slug === 'visura-catastale-storica' ? 'storica' : 'ordinaria'
  const base: Record<string, string> = {
    tipo_catasto: fd.tipo_catasto || 'F',
    tipo_visura: tipoVisura,
    tipo_dettaglio: fd.tipo_dettaglio || 'sintetica',
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

function post(url: string, payload: unknown): Promise<void> {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(() => {}).catch(() => {})
}

async function fireWebhooks(
  orders: OrderItem[],
  email: string,
  emailDocumenti: string,
  userId: string | null,
  orderRef: string
) {
  const slugToTipoServizio: Record<string, string> = {
    'prospetto-catastale': 'prospetto_catastale',
    'ricerca-persona': 'ricerca_persona',
    'ricerca-nazionale': 'ricerca_nazionale',
    'ricerca-indirizzo': 'ricerca_indirizzo',
  }

  const promises: Promise<void>[] = []

  for (const order of orders) {
    const fd = order.formData
    const base: Record<string, string> = userId
      ? { user_id: userId, order_ref: orderRef }
      : { order_ref: orderRef }

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
      const payload = buildVisuraPayload(order, email, emailDocumenti || undefined, userId, orderRef)
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
        const tipoRestrizione = mode === 'soggetto-giuridico' ? 'soggettogiuridico' : 'soggettofisico'
        const payload: Record<string, string | number> = {
          tiporestrizione: tipoRestrizione,
          tipo_registro: tipoRegistro,
          conservatoria: fd.conservatoria || '',
          anno: Number(fd.anno) || 0,
          cf_piva: fd.cf_piva || '',
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
          tiporestrizione: 'immobile',
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

export async function POST(request: NextRequest) {
  try {
    const { orders, email, emailDocumenti } = await request.json()

    if (!orders || !email) {
      return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id ?? null

    const orderRef = `PRSP-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${new Date().getFullYear()}`

    let saved = false
    if (userId) {
      const { error: insertError } = await supabase.from('orders').insert({
        order_ref: orderRef,
        email: user!.email!,
        user_id: userId,
        items: orders,
      })
      if (insertError) {
        console.error('[process-order] insert failed:', insertError.message, insertError.code)
      } else {
        saved = true
      }
    }

    after(() => fireWebhooks(orders, email, emailDocumenti ?? '', userId, orderRef))

    return NextResponse.json({ orderRef, saved })
  } catch {
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
