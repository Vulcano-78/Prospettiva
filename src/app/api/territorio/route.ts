import { NextResponse } from 'next/server';

const TOKEN = 'Bearer 9trpvshrj4orafoqtickmulz6dkfkr3u';

export async function GET() {
  const res = await fetch('https://test.catasto.openapi.it/territorio', {
    headers: { Authorization: TOKEN },
  });
  const text = await res.text();
  console.log('[territorio] status:', res.status, 'body:', text.slice(0, 500));
  try {
    return NextResponse.json(JSON.parse(text));
  } catch {
    return NextResponse.json({ error: 'parse error', raw: text.slice(0, 500) }, { status: 500 });
  }
}
