import { NextResponse } from 'next/server';
import { getCatastoBaseUrl, getCatastoToken } from '@/lib/openapi';

const CACHE_HEADER = 'public, max-age=86400, stale-while-revalidate=604800';
const PROVINCIA_RE = /^[A-Z]{2}$/;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ provincia: string }> }
) {
  const { provincia } = await params;

  if (!PROVINCIA_RE.test(provincia)) {
    return NextResponse.json(
      { error: 'Sigla provincia non valida (attese 2 lettere maiuscole)' },
      { status: 400 }
    );
  }

  const token = getCatastoToken();
  if (!token) {
    console.error('[catasto/territorio/:provincia] OPENAPI_TOKEN missing');
    return NextResponse.json(
      { error: 'Configurazione server mancante (OPENAPI_TOKEN)' },
      { status: 500 }
    );
  }

  const url = `${getCatastoBaseUrl()}/territorio/${provincia}?tipo_catasto=F`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(
        `[catasto/territorio/${provincia}] upstream`,
        res.status,
        text.slice(0, 500)
      );
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
    console.error(`[catasto/territorio/${provincia}] network error`, err);
    return NextResponse.json({ error: 'Errore di rete verso il provider' }, { status: 502 });
  }
}
