import { NextResponse } from 'next/server';

const TOKEN = 'Bearer 9trpvshrj4orafoqtickmulz6dkfkr3u';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ provincia: string }> }
) {
  const { provincia } = await params;
  const res = await fetch(`https://test.catasto.openapi.it/territorio/${provincia}`, {
    headers: { Authorization: TOKEN },
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
