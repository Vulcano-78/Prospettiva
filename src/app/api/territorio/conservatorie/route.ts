import { NextResponse } from 'next/server'

export const revalidate = 86400 // cache 24h

export async function GET() {
  const apiKey = process.env.OPENAPI_TOKEN
  const baseUrl = process.env.OPENAPI_BASE_URL ?? 'https://test.catasto.openapi.it'

  if (!apiKey) {
    return NextResponse.json({ error: 'missing config' }, { status: 500 })
  }

  const res = await fetch(`${baseUrl}/territorio/conservatorie`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    next: { revalidate: 86400 },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'upstream error', status: res.status }, { status: 502 })
  }

  const json = await res.json()
  const list: { conservatoria: string; id: string }[] = json.data ?? []

  return NextResponse.json(list)
}
