import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { email, slug } = await req.json()
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email non valida' }, { status: 400 })
    }
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Slug mancante' }, { status: 400 })
    }
    const supabase = createAdminClient()
    const { error } = await supabase.from('email_notifications').insert({ email: email.toLowerCase().trim(), slug })
    if (error) {
      console.error('[notifications]', error)
      return NextResponse.json({ error: 'Errore salvataggio' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[notifications]', err)
    return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 })
  }
}
