'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { useCart } from '@/context/CartContext';

function buildVisuraPayload(order: { slug: string; formData: Record<string, string> }, email: string, emailDocumenti?: string) {
  const fd = order.formData;
  const searchType = fd._searchType || 'immobile';
  const tipoVisura = order.slug === 'visura-catastale-storica' ? 'storica' : 'ordinaria';
  const base: Record<string, string> = {
    tipo_catasto: fd.tipo_catasto || 'F',
    tipo_visura: tipoVisura,
    tipo_dettaglio: fd.tipo_dettaglio || 'sintetica',
    email,
  };
  if (emailDocumenti) {
    base.email_documenti = emailDocumenti;
  }

  if (searchType === 'immobile') {
    const payload: Record<string, string> = {
      entita: 'immobile',
      provincia: (fd.provincia || '').toUpperCase(),
      comune: (fd.comune || '').toUpperCase(),
      foglio: fd.foglio || '',
      particella: fd.particella || '',
      ...base,
    };
    if (fd.subalterno) payload.subalterno = fd.subalterno;
    return payload;
  }

  return {
    entita: 'soggetto',
    cf_piva: fd.cf_piva || '',
    provincia: (fd.provincia || '').toUpperCase(),
    ...base,
  };
}

export default function ConfirmationPage() {
  const { clearCart, items } = useCart();
  const webhookSent = useRef(false);

  useEffect(() => {
    if (items.length > 0) {
      clearCart();
    }
  }, [clearCart, items.length]);

  // Send pending visura orders to n8n after payment
  useEffect(() => {
    if (webhookSent.current) return;
    webhookSent.current = true;

    try {
      const raw = localStorage.getItem('pendingOrder');
      if (!raw) return;
      const orders: { slug: string; formData: Record<string, string> }[] = JSON.parse(raw);
      const checkoutEmail = localStorage.getItem('checkoutEmail') || '';
      const checkoutEmailDocumenti = localStorage.getItem('checkoutEmailDocumenti') || '';
      localStorage.removeItem('pendingOrder');
      localStorage.removeItem('checkoutEmail');
      localStorage.removeItem('checkoutEmailDocumenti');

      for (const order of orders) {
        if (order.slug === 'estratto-mappa') {
          const fd = order.formData;
          const payload: Record<string, string> = {
            provincia: (fd.provincia || '').toUpperCase(),
            comune: (fd.comune || '').toUpperCase(),
            foglio: fd.foglio || '',
            particella: fd.particella || '',
            email: checkoutEmail,
          };
          if (fd.sezione) payload.sezione = fd.sezione;
          fetch('https://n8n.vulcano.tools/webhook-test/estratto-mappa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }).catch(() => { /* silent fail */ });
        }

        if (order.slug === 'elaborato-planimetrico') {
          const fd = order.formData;
          const payload: Record<string, string> = {
            provincia: (fd.provincia || '').toUpperCase(),
            comune: (fd.comune || '').toUpperCase(),
            foglio: fd.foglio || '',
            particella: fd.particella || '',
            email: checkoutEmail,
          };
          if (fd.sezione) payload.sezione = fd.sezione;
          fetch('https://n8n.vulcano.tools/webhook/elaborato-planimetrico', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }).catch(() => { /* silent fail */ });
        }

        const slugToTipoServizio: Record<string, string> = {
          'prospetto-catastale': 'prospetto_catastale',
          'ricerca-persona': 'ricerca_persona',
          'ricerca-nazionale': 'ricerca_nazionale',
          'ricerca-indirizzo': 'ricerca_indirizzo',
        };

        if (order.slug in slugToTipoServizio) {
          const fd = order.formData;
          const tipo_servizio = slugToTipoServizio[order.slug];
          const payload: Record<string, string> = { tipo_servizio, email: checkoutEmail };

          payload.tipo_catasto = fd.tipo_catasto || 'F';
          if (fd.provincia) payload.provincia = fd.provincia.toUpperCase();
          if (fd.comune) payload.comune = fd.comune.toUpperCase();
          if (fd.foglio) payload.foglio = fd.foglio;
          if (fd.particella) payload.particella = fd.particella;
          if (fd.subalterno) payload.subalterno = fd.subalterno;
          if (fd.cf_piva) payload.cf_piva = fd.cf_piva;
          if (fd.indirizzo) payload.indirizzo = fd.indirizzo;

          fetch('https://n8n.vulcano.tools/webhook/richiesta-catastale', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }).catch(() => { /* silent fail */ });
        }

        if (order.slug === 'visura-catastale' || order.slug === 'visura-catastale-storica') {
          const payload = buildVisuraPayload(order, checkoutEmail, checkoutEmailDocumenti || undefined);
          const searchType = order.formData._searchType || 'immobile';
          const webhookUrl = (searchType === 'soggetto' || searchType === 'soggetto-giuridico')
            ? 'https://n8n.vulcano.tools/webhook-test/visura-catastale-soggetto'
            : 'https://n8n.vulcano.tools/webhook-test/visura-catastale';
          fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }).catch(() => { /* silent fail */ });
        }
      }
    } catch { /* localStorage or parse error */ }
  }, []);

  const orderId = `PRSP-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${new Date().getFullYear()}`;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <main className="flex-grow flex flex-col items-center px-6 pt-20 pb-8">
        <div className="max-w-4xl w-full">
          {/* Success Header */}
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-[#28a428] mb-4 block" style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', fontVariationSettings: "'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 48" }}>
              check
            </span>
            <span className="block text-xs font-bold uppercase tracking-widest text-[#516169] mb-4">
              Ordine Confermato
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#002147] tracking-tight leading-tight mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
              La tua richiesta e in elaborazione.
            </h1>
            <p className="text-base text-[#44474e] max-w-xl mx-auto">
              I nostri sistemi stanno elaborando i dati catastali aggiornati. Riceverai il documento direttamente nella tua casella email.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Order Details Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#516169] mb-1">
                      Tempo Stimato
                    </p>
                    <p className="text-3xl font-extrabold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      Entro 60 minuti
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <span className="material-symbols-outlined text-[#002147]">schedule</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <span className="material-symbols-outlined text-[#4463ee]">speed</span>
                    <p className="text-sm text-[#44474e]">
                      La maggior parte degli ordini viene evasa in pochi minuti. I tempi possono variare in base ai sistemi dell&apos;Agenzia delle Entrate.
                    </p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="material-symbols-outlined text-[#4463ee]">mail</span>
                    <p className="text-sm text-[#44474e]">
                      Controlla la tua email per il download. Ti avviseremo appena il file sara pronto.
                    </p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="material-symbols-outlined text-[#516169]">verified_user</span>
                    <p className="text-sm text-[#44474e]">
                      Documento estratto dai database ufficiali dell&apos;Agenzia delle Entrate.
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <p className="text-xs text-[#516169] italic">ID Ordine: #{orderId}</p>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-[#002147] text-white rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-extrabold mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Il tuo Archivio Documentale
              </h2>
              <p className="text-[#708ab5] mb-6 text-sm leading-relaxed">
                Non perdere mai piu una visura. Con l&apos;archivio digitale puoi conservare, organizzare e consultare tutti i tuoi documenti acquistati in un unico posto sicuro.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-[#4463ee]">folder_shared</span>
                  Accesso immediato allo storico ordini
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-[#4463ee]">cloud_download</span>
                  Download illimitati dei tuoi PDF
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-[#4463ee]">security</span>
                  Protezione crittografata dei dati
                </li>
              </ul>

              <Link
                href="/registrazione"
                className="block w-full bg-[#4463ee] text-white text-center font-extrabold py-4 rounded-xl hover:brightness-110 transition-all shadow-lg"
              >
                Accedi o crea il tuo Archivio
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#4463ee] text-white font-bold px-8 py-4 rounded-xl hover:brightness-110 transition-all"
            >
              Esplora altri strumenti
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          {/* Support Box */}
          <div className="mt-12 bg-white border border-slate-100 rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-3xl text-[#4463ee] mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
              help
            </span>
            <h3 className="font-bold text-[#002147] mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Serve aiuto?
            </h3>
            <p className="text-sm text-[#44474e] mb-3">
              Il nostro supporto tecnico e a tua disposizione per qualsiasi chiarimento.
            </p>
            <a
              href="mailto:info@prospettiva.io"
              className="text-[#002147] font-bold text-sm hover:underline"
            >
              Contatta assistenza
            </a>
          </div>
        </div>
      </main>

    </div>
  );
}
