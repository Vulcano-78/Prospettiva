import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.OPENAPI_TOKEN_SANDBOX ?? '9trpvshrj4orafoqtickmulz6dkfkr3u';

  const res = await fetch('https://test.catasto.openapi.it/territorio/conservatorie', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
