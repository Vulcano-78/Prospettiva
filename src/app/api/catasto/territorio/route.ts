import { NextResponse } from 'next/server';
import { getCatastoBaseUrl, getCatastoToken } from '@/lib/openapi';

const CACHE_HEADER = 'public, max-age=86400, stale-while-revalidate=604800';

export async function GET() {
  const token = getCatastoToken();
  if (!token) {
    console.error('[catasto/territorio] OPENAPI_TOKEN missing');
    return NextResponse.json(
      { error: 'Configurazione server mancante (OPENAPI_TOKEN)' },
      { status: 500 }
    );
  }

  const url = `${getCatastoBaseUrl()}/territorio?tipo_catasto=F`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      // edge fetch — Next.js handles its own caching via response headers
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[catasto/territorio] upstream', res.status, text.slice(0, 500));
      return NextResponse.json(
        { error: `Provider responded with ${res.status}` },
        { status: res.status >= 500 ? 502 : res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': CACHE_HEADER },
    });
  } catch (err) {
    console.error('[catasto/territorio] network error', err);
    return NextResponse.json({ error: 'Errore di rete verso il provider' }, { status: 502 });
  }
}
