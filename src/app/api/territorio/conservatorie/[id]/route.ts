import { NextResponse } from 'next/server'

export const revalidate = 86400

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const apiKey = process.env.OPENAPI_TOKEN
  const baseUrl = process.env.OPENAPI_BASE_URL ?? 'https://test.catasto.openapi.it'

  if (!apiKey) {
    return NextResponse.json({ error: 'missing config' }, { status: 500 })
  }

  const res = await fetch(
    `${baseUrl}/territorio/conservatorie/${encodeURIComponent(id)}`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 86400 },
    }
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'upstream error', status: res.status }, { status: 502 })
  }

  const json = await res.json()
  // Response can be option 0 (::props) or option 1 (plain object)
  const data = json.data ?? json
  const comuni: { comune: string; codice_catastale?: string }[] = data?.comuni ?? []

  return NextResponse.json(comuni)
}
