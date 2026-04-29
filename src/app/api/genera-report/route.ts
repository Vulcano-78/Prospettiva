import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

export const runtime = 'nodejs';

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
};

function buildPdf(
  tipoReport: string,
  dati: Record<string, unknown>,
  parametriRichiesta: Record<string, unknown>
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
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

    doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(20).text('prospettiva', 50, 24, { continued: true });
    doc.fillColor(BLUE).text('.io');

    doc
      .fillColor(WHITE)
      .font('Helvetica')
      .fontSize(9)
      .text(`Generato il ${dateStr} alle ${timeStr}`, 50, 50, { align: 'right', width: contentWidth });

    // ── Title ────────────────────────────────────────────────────────
    doc.fillColor(NAVY).font('Helvetica-Bold').fontSize(18).text(tipoLabel, 50, 100);

    doc.moveTo(50, 124).lineTo(pageWidth - 50, 124).strokeColor(BLUE).lineWidth(2).stroke();

    let y = 140;

    // ── Helpers ──────────────────────────────────────────────────────
    function drawSectionTitle(title: string) {
      doc.rect(50, y, contentWidth, 24).fill(NAVY);
      doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(9).text(title.toUpperCase(), 58, y + 7);
      y += 32;
    }

    function drawRow(label: string, value: string, shade: boolean) {
      const rowH = 20;
      if (shade) doc.rect(50, y, contentWidth, rowH).fill(LIGHT_GREY);
      doc.fillColor(GREY).font('Helvetica-Bold').fontSize(8).text(label, 58, y + 5, { width: 180 });
      doc.fillColor(NAVY).font('Helvetica').fontSize(8).text(String(value ?? '—'), 244, y + 5, { width: contentWidth - 196 });
      y += rowH;
    }

    function drawTableHeader(columns: string[]) {
      const colW = contentWidth / columns.length;
      doc.rect(50, y, contentWidth, 22).fill(NAVY);
      columns.forEach((col, i) => {
        doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(8).text(col.toUpperCase(), 58 + i * colW, y + 6, { width: colW - 8 });
      });
      y += 22;
    }

    function drawTableRow(cells: string[], shade: boolean) {
      const colW = contentWidth / cells.length;
      const rowH = 18;
      if (shade) doc.rect(50, y, contentWidth, rowH).fill(LIGHT_GREY);
      cells.forEach((cell, i) => {
        doc.fillColor(NAVY).font('Helvetica').fontSize(8).text(String(cell ?? '—'), 58 + i * colW, y + 4, { width: colW - 8 });
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

    if (Array.isArray(dati)) {
      if (dati.length === 0) {
        doc.fillColor(GREY).font('Helvetica').fontSize(9).text('Nessun risultato trovato.', 58, y);
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
      .font('Helvetica')
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
  try {
    const body = await req.json();
    const { tipo_report, dati: rawDati, parametri_richiesta: rawParametri } = body;

    if (!tipo_report) {
      return NextResponse.json(
        { error: 'Campo obbligatorio mancante: tipo_report' },
        { status: 400 }
      );
    }

    const dati = parseField(rawDati);
    const parametri_richiesta = parseField(rawParametri);

    const pdfBuffer = await buildPdf(
      tipo_report,
      dati as Record<string, unknown>,
      parametri_richiesta as Record<string, unknown>
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${tipo_report}-${Date.now()}.pdf"`,
        'Content-Length': String(pdfBuffer.length),
      },
    });
  } catch (err) {
    console.error('[genera-report]', err);
    return NextResponse.json({ error: 'Errore nella generazione del PDF' }, { status: 500 });
  }
}
