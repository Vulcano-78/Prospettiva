import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { email, message } = await req.json()
    if (!message || typeof message !== 'string' || message.trim().length < 3) {
      return NextResponse.json({ error: 'Messaggio troppo breve' }, { status: 400 })
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: 'Messaggio troppo lungo' }, { status: 400 })
    }
    if (email && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      return NextResponse.json({ error: 'Email non valida' }, { status: 400 })
    }
    const supabase = createAdminClient()
    const { error } = await supabase.from('suggestions').insert({
      email: email ? email.toLowerCase().trim() : null,
      message: message.trim(),
    })
    if (error) {
      console.error('[suggestions]', error)
      return NextResponse.json({ error: 'Errore salvataggio' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[suggestions]', err)
    return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 })
  }
}
