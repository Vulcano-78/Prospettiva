import { NextResponse } from 'next/server';

const TOKEN = 'Bearer 9trpvshrj4orafoqtickmulz6dkfkr3u';

export async function GET() {
  const res = await fetch('https://test.catasto.openapi.it/territorio', {
    headers: { Authorization: TOKEN },
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
