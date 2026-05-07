import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const runtime = 'nodejs'

function tokenFor(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    const expected = process.env.ADMIN_PASSWORD
    if (!expected) {
      return NextResponse.json({ error: 'ADMIN_PASSWORD non configurata' }, { status: 500 })
    }
    if (typeof password !== 'string' || password !== expected) {
      return NextResponse.json({ error: 'Password errata' }, { status: 401 })
    }
    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin_session', tokenFor(expected), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 giorni
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 })
  }
}
