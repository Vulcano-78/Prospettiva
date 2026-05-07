import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

export const runtime = 'nodejs';

const FONT_REGULAR = path.join(process.cwd(), 'public/fonts/Roboto-Regular.ttf');
const FONT_BOLD = path.join(process.cwd(), 'public/fonts/Roboto-Bold.ttf');

const NAVY = '#002147';
const BLUE = '#4463EE';
const GREY = '#516169';
const LIGHT_GREY = '#f0f2f5';
const WHITE = '#ffffff';

const TIPO_LABEL: Record<string, string> = {
  prospetto_catastale: 'Prospetto Catastale',
  ricerca_persona: 'Ricerca per Soggetto',
  ricerca_nazionale: 'Ricerca Nazionale',
  ricerca_indirizzo: 'Ricerca per Indirizzo',
  visura_catastale: 'Visura Catastale',
  estratto_mappa: 'Estratto di Mappa',
  elaborato_planimetrico: 'Elaborato Planimetrico',
  ispezione_ipotecaria_nazionale: 'Ispezione Ipotecaria Nazionale',
};

function buildPdf(
  tipoReport: string,
  dati: Record<string, unknown>,
  parametriRichiesta: Record<string, unknown>
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4', font: FONT_REGULAR });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - 100;
    const now = new Date();
    const dateStr = now.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const tipoLabel = TIPO_LABEL[tipoReport] || tipoReport;

    // ── Header bar ──────────────────────────────────────────────────
    doc.rect(0, 0, pageWidth, 72).fill(NAVY);

    doc.fillColor(WHITE).font(FONT_BOLD).fontSize(20).text('prospettiva', 50, 24, { continued: true });
    doc.fillColor(BLUE).text('.io');

    doc
      .fillColor(WHITE)
      .font(FONT_REGULAR)
      .fontSize(9)
      .text(`Generato il ${dateStr} alle ${timeStr}`, 50, 50, { align: 'right', width: contentWidth });

    // ── Title ────────────────────────────────────────────────────────
    doc.fillColor(NAVY).font(FONT_BOLD).fontSize(18).text(tipoLabel, 50, 100);

    doc.moveTo(50, 124).lineTo(pageWidth - 50, 124).strokeColor(BLUE).lineWidth(2).stroke();

    let y = 140;

    // ── Helpers ──────────────────────────────────────────────────────
    function drawSectionTitle(title: string) {
      doc.rect(50, y, contentWidth, 24).fill(NAVY);
      doc.fillColor(WHITE).font(FONT_BOLD).fontSize(9).text(title.toUpperCase(), 58, y + 7);
      y += 32;
    }

    function drawRow(label: string, value: string, shade: boolean) {
      const rowH = 20;
      if (shade) doc.rect(50, y, contentWidth, rowH).fill(LIGHT_GREY);
      doc.fillColor(GREY).font(FONT_BOLD).fontSize(8).text(label, 58, y + 5, { width: 180 });
      doc.fillColor(NAVY).font(FONT_REGULAR).fontSize(8).text(String(value ?? '—'), 244, y + 5, { width: contentWidth - 196 });
      y += rowH;
    }

    function drawTableHeader(columns: string[]) {
      const colW = contentWidth / columns.length;
      doc.rect(50, y, contentWidth, 22).fill(NAVY);
      columns.forEach((col, i) => {
        doc.fillColor(WHITE).font(FONT_BOLD).fontSize(8).text(col.toUpperCase(), 58 + i * colW, y + 6, { width: colW - 8 });
      });
      y += 22;
    }

    function drawTableRow(cells: string[], shade: boolean) {
      const colW = contentWidth / cells.length;
      const rowH = 18;
      if (shade) doc.rect(50, y, contentWidth, rowH).fill(LIGHT_GREY);
      cells.forEach((cell, i) => {
        doc.fillColor(NAVY).font(FONT_REGULAR).fontSize(8).text(String(cell ?? '—'), 58 + i * colW, y + 4, { width: colW - 8 });
      });
      y += rowH;
    }

    // ── Parametri richiesta ──────────────────────────────────────────
    drawSectionTitle('Parametri della richiesta');
    const params = Object.entries(parametriRichiesta).filter(([, v]) => v !== null && v !== undefined && v !== '');
    params.forEach(([k, v], i) => {
      const label = k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      drawRow(label, String(v), i % 2 === 0);
    });
    y += 16;

    // ── Risultati ────────────────────────────────────────────────────
    drawSectionTitle('Risultati');

    // Renderer specializzato per ispezione ipotecaria nazionale
    if (tipoReport === 'ispezione_ipotecaria_nazionale') {
      type Conservatoria = { conservatoria: string; trascrizioni: string; iscrizioni: string; annotazioni: string };
      type Soggetto = { cognome?: string; nome?: string; cf?: string; data_nascita?: string; luogo_nascita?: string; sesso?: string; conservatorie?: Conservatoria[] };
      const soggetti: Soggetto[] = Array.isArray(dati) ? dati as Soggetto[] : [];

      if (soggetti.length === 0) {
        doc.fillColor(GREY).font(FONT_REGULAR).fontSize(9).text('Nessun soggetto trovato.', 58, y);
        y += 20;
      }

      soggetti.forEach((s, si) => {
        if (y > doc.page.height - 120) { doc.addPage(); y = 50; }

        // Intestazione soggetto
        doc.rect(50, y, contentWidth, 24).fill(BLUE);
        doc.fillColor(WHITE).font(FONT_BOLD).fontSize(9)
          .text(`${s.cognome ?? ''} ${s.nome ?? ''}`.trim(), 58, y + 7, { width: contentWidth / 2 });
        doc.fillColor(WHITE).font(FONT_REGULAR).fontSize(9)
          .text(`CF: ${s.cf ?? '—'}`, 58 + contentWidth / 2, y + 7, { width: contentWidth / 2 - 8, align: 'right' });
        y += 32;

        const infoRows = [
          ['Data di nascita', s.data_nascita ?? '—'],
          ['Luogo di nascita', s.luogo_nascita ?? '—'],
          ['Sesso', s.sesso ?? '—'],
        ];
        infoRows.forEach(([label, value], i) => drawRow(label, value, i % 2 === 0));
        y += 10;

        // Tabella conservatorie
        const conss = s.conservatorie ?? [];
        if (conss.length > 0) {
          if (y > doc.page.height - 80) { doc.addPage(); y = 50; }
          doc.fillColor(GREY).font(FONT_BOLD).fontSize(8).text('CONSERVATORIE CON FORMALITÀ', 58, y);
          y += 14;
          drawTableHeader(['Conservatoria', 'Trascrizioni', 'Iscrizioni', 'Annotazioni']);
          conss.forEach((c, i) => {
            if (y > doc.page.height - 80) { doc.addPage(); y = 50; }
            drawTableRow([c.conservatoria ?? '—', c.trascrizioni ?? '—', c.iscrizioni ?? '—', c.annotazioni ?? '—'], i % 2 === 0);
          });
        } else {
          doc.fillColor(GREY).font(FONT_REGULAR).fontSize(9).text('Nessuna conservatoria trovata per questo soggetto.', 58, y);
          y += 16;
        }

        if (si < soggetti.length - 1) y += 20;
      });
    } else if (Array.isArray(dati)) {
      if (dati.length === 0) {
        doc.fillColor(GREY).font(FONT_REGULAR).fontSize(9).text('Nessun risultato trovato.', 58, y);
        y += 20;
      } else {
        const columns = Object.keys(dati[0] as Record<string, unknown>);
        drawTableHeader(columns);
        (dati as Record<string, unknown>[]).forEach((row, i) => {
          if (y > doc.page.height - 80) { doc.addPage(); y = 50; }
          drawTableRow(columns.map(c => String(row[c] ?? '—')), i % 2 === 0);
        });
      }
    } else if (typeof dati === 'object' && dati !== null) {
      Object.entries(dati).forEach(([k, v], i) => {
        if (y > doc.page.height - 80) { doc.addPage(); y = 50; }
        const label = k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const val = Array.isArray(v) ? v.join(', ') : typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v ?? '—');
        drawRow(label, val, i % 2 === 0);
      });
    }

    // ── Footer ───────────────────────────────────────────────────────
    const footerY = doc.page.height - 40;
    doc.moveTo(50, footerY - 8).lineTo(pageWidth - 50, footerY - 8).strokeColor(LIGHT_GREY).lineWidth(1).stroke();
    doc
      .fillColor(GREY)
      .font(FONT_REGULAR)
      .fontSize(7)
      .text('Documento generato da prospettiva.io — uso interno, non ha valore legale autonomo.', 50, footerY, {
        align: 'center',
        width: contentWidth,
      });

    doc.end();
  });
}

function parseField(value: unknown): unknown {
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return value; }
  }
  return value ?? {};
}

export async function POST(req: NextRequest) {
  let bodyKeys: string[] = [];
  try {
    const body = await req.json();
    bodyKeys = Object.keys(body || {});
    const { tipo_report, dati: rawDati, parametri_richiesta: rawParametri } = body;

    if (!tipo_report) {
      console.error('[genera-report]', { error: 'tipo_report mancante', bodyKeys });
      return NextResponse.json(
        { error: 'Campo obbligatorio mancante: tipo_report' },
        { status: 400 }
      );
    }

    if (rawDati === undefined || rawDati === null) {
      console.error('[genera-report]', { error: 'dati mancante', bodyKeys });
      return NextResponse.json(
        { error: 'Campo obbligatorio mancante: dati' },
        { status: 400 }
      );
    }

    const dati = parseField(rawDati);
    const parametri_richiesta = parseField(rawParametri);

    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await buildPdf(
        tipo_report,
        dati as Record<string, unknown>,
        parametri_richiesta as Record<string, unknown>
      );
    } catch (pdfErr) {
      const msg = pdfErr instanceof Error ? pdfErr.message : String(pdfErr);
      const code = /afm|font|ttf/i.test(msg) ? 'FONT_NOT_FOUND' : 'PDF_ERROR';
      console.error('[genera-report]', {
        error: msg,
        stack: pdfErr instanceof Error ? pdfErr.stack : undefined,
        bodyKeys,
        code,
      });
      return NextResponse.json({ error: code }, { status: 500 });
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${tipo_report}-${Date.now()}.pdf"`,
        'Content-Length': String(pdfBuffer.length),
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[genera-report]', {
      error: msg,
      stack: err instanceof Error ? err.stack : undefined,
      bodyKeys,
    });
    return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 });
  }
}
