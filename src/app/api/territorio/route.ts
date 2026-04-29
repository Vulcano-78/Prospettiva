import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.OPENAPI_TOKEN;
  if (!token) return NextResponse.json({ error: 'token mancante' }, { status: 500 });

  const res = await fetch('https://test.catasto.openapi.it/territorio', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
