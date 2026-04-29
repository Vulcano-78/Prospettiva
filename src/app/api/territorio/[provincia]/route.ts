import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ provincia: string }> }
) {
  const token = process.env.OPENAPI_TOKEN;
  if (!token) return NextResponse.json({ error: 'token mancante' }, { status: 500 });

  const { provincia } = await params;
  const res = await fetch(`https://catasto.openapi.it/territorio/${provincia}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
