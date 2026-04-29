import { NextResponse } from 'next/server';

const TOKEN = 'Bearer 69f1f8a1c17fe9edfd088ff4';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ provincia: string }> }
) {
  const { provincia } = await params;
  const url = `https://test.catasto.openapi.it/territorio/${provincia}`;
  const res = await fetch(url, { headers: { Authorization: TOKEN } });
  const text = await res.text();
  console.log('[territorio/provincia] status:', res.status, 'body:', text.slice(0, 300));
  try {
    return NextResponse.json(JSON.parse(text));
  } catch {
    return NextResponse.json({ error: 'parse error', status: res.status, raw: text.slice(0, 300) }, { status: 500 });
  }
}
