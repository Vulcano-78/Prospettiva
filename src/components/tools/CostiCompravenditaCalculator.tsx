'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { getServiceBySlug } from '@/data/services';
import {
  CATEGORIE_LUSSO,
  CATEGORIE_STANDARD,
  CategoriaCatastale,
  Destinazione,
  TipoVenditore,
  calcolaCostiCompravendita,
  formatEur,
} from '@/lib/calcoli/costi-compravendita';

type DataLayerWindow = Window & { dataLayer?: Array<Record<string, unknown>> };
function track(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...payload });
}

function parseNumber(v: string): number {
  const n = parseFloat(v.replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}
function formatInputNumber(v: string, allowDecimals = true): string {
  const cleaned = v.replace(allowDecimals ? /[^\d,]/g : /[^\d]/g, '');
  const [intRaw, ...rest] = cleaned.split(',');
  const intPart = (intRaw || '').replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  if (!allowDecimals || rest.length === 0) return intPart;
  const dec = rest.join('').slice(0, 2);
  return `${intPart || '0'},${dec}`;
}

const TOOLTIPS: Record<string, string> = {
  registro: 'Imposta di registro: dovuta all\'Agenzia delle Entrate. Per i privati si calcola sul valore catastale (prezzo-valore); per le imprese è fissa.',
  ipotecaria: 'Imposta dovuta per la trascrizione dell\'atto nei registri immobiliari.',
  catastale: 'Imposta per la voltura catastale a favore del nuovo proprietario.',
  iva: 'IVA applicata solo quando il venditore è un\'impresa con vendita imponibile. Aliquote: 4% prima casa, 10% seconda casa, 22% lusso.',
  valore: 'Valore catastale = rendita catastale × 1,05 × moltiplicatore (110 prima casa, 120 altre). È la base imponibile per il calcolo delle imposte sull\'acquisto da privato.',
};

export default function CostiCompravenditaCalculator() {
  const router = useRouter();
  const { addItem } = useCart();

  const [tipoVenditore, setTipoVenditore] = useState<TipoVenditore>('privato');
  const [destinazione, setDestinazione] = useState<Destinazione>('prima_casa');
  const [categoria, setCategoria] = useState<CategoriaCatastale>('A/3');
  const [prezzoStr, setPrezzoStr] = useState('');
  const [renditaStr, setRenditaStr] = useState('');
  const [openTip, setOpenTip] = useState<string | null>(null);

  const prezzo = parseNumber(prezzoStr);
  const rendita = parseNumber(renditaStr);

  const renditaRichiesta = tipoVenditore === 'privato';
  const prezzoValido = prezzo >= 10000;
  const renditaValida = !renditaRichiesta || rendita > 0;
  const isValid = prezzoValido && renditaValida;

  const result = useMemo(() => {
    if (!isValid) return null;
    const r = calcolaCostiCompravendita({
      tipoVenditore, destinazione, categoria, prezzo,
      rendita: renditaRichiesta ? rendita : undefined,
    });
    track('calcolo_completato', {
      tool: 'calcolatore-costi-compravendita',
      tipo_venditore: tipoVenditore,
      destinazione, categoria,
    });
    return r;
  }, [isValid, tipoVenditore, destinazione, categoria, prezzo, rendita, renditaRichiesta]);

  const handleAddVisura = () => {
    track('click_cta_visura', { source: 'calcolatore-costi-compravendita' });
    const visura = getServiceBySlug('visura-catastale');
    if (visura) {
      addItem(visura);
      router.push('/carrello');
    }
  };

  const handleBundleCta = () => {
    track('click_cta_bundle', { source: 'calcolatore-costi-compravendita' });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <header className="mb-8">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Utility gratuita</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#002147] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Calcolatore Costi Compravendita
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl">
            Stima in 30 secondi imposte di registro, ipotecaria, catastale, IVA e onorario notarile per l&apos;acquisto di un immobile in Italia.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          {/* FORM */}
          <div className="space-y-6">
            {/* Venditore */}
            <section className="bg-white rounded-xl border border-slate-100 p-6">
              <h2 className="text-sm font-extrabold text-[#002147] mb-4 uppercase tracking-widest">Tipo di venditore</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {([
                  { v: 'privato', label: 'Privato', sub: 'No IVA — prezzo-valore' },
                  { v: 'impresa', label: 'Impresa con IVA', sub: 'Vendita imponibile IVA' },
                ] as const).map(opt => (
                  <button key={opt.v}
                    type="button"
                    onClick={() => setTipoVenditore(opt.v)}
                    className={`text-left rounded-lg border p-4 transition-colors ${tipoVenditore === opt.v ? 'border-[#4463EE] bg-[#4463EE]/5' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <div className="text-sm font-bold text-[#002147]">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{opt.sub}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* Destinazione */}
            <section className="bg-white rounded-xl border border-slate-100 p-6">
              <h2 className="text-sm font-extrabold text-[#002147] mb-4 uppercase tracking-widest">Destinazione</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {([
                  { v: 'prima_casa', label: 'Prima casa', sub: 'Residenza nel comune entro 18 mesi' },
                  { v: 'seconda_casa', label: 'Seconda casa', sub: 'Investimento o non abitazione principale' },
                ] as const).map(opt => (
                  <button key={opt.v}
                    type="button"
                    onClick={() => setDestinazione(opt.v)}
                    className={`text-left rounded-lg border p-4 transition-colors ${destinazione === opt.v ? 'border-[#4463EE] bg-[#4463EE]/5' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <div className="text-sm font-bold text-[#002147]">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{opt.sub}</div>
                  </button>
                ))}
              </div>
              {destinazione === 'prima_casa' && CATEGORIE_LUSSO.includes(categoria) && (
                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 mt-3 rounded-lg p-3">
                  Le categorie di lusso (A/1, A/8, A/9) non possono beneficiare dell&apos;agevolazione prima casa: applichiamo le aliquote ordinarie.
                </p>
              )}
            </section>

            {/* Categoria + prezzo + rendita */}
            <section className="bg-white rounded-xl border border-slate-100 p-6">
              <h2 className="text-sm font-extrabold text-[#002147] mb-4 uppercase tracking-widest">Immobile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Categoria catastale</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as CategoriaCatastale)}
                    className="w-full h-[46px] rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#002147] focus:outline-none focus:border-[#4463EE]"
                  >
                    <optgroup label="Standard">
                      {CATEGORIE_STANDARD.map(c => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                    <optgroup label="Lusso">
                      {CATEGORIE_LUSSO.map(c => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Prezzo di acquisto</label>
                  <div className="relative">
                    <input
                      inputMode="decimal"
                      placeholder="200.000"
                      value={prezzoStr}
                      onChange={(e) => setPrezzoStr(formatInputNumber(e.target.value, false))}
                      className="w-full h-[46px] rounded-lg border border-slate-200 bg-white px-3 pr-8 text-sm text-[#002147] focus:outline-none focus:border-[#4463EE]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">€</span>
                  </div>
                  {prezzoStr && !prezzoValido && (
                    <p className="text-[11px] text-red-600 mt-1">Inserisci un prezzo di almeno 10.000 €.</p>
                  )}
                </div>
                {renditaRichiesta && (
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Rendita catastale</label>
                    <div className="relative">
                      <input
                        inputMode="decimal"
                        placeholder="450,00"
                        value={renditaStr}
                        onChange={(e) => setRenditaStr(formatInputNumber(e.target.value, true))}
                        className="w-full h-[46px] rounded-lg border border-slate-200 bg-white px-3 pr-8 text-sm text-[#002147] focus:outline-none focus:border-[#4463EE]"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">€</span>
                    </div>
                  </div>
                )}
              </div>

              {renditaRichiesta && (
                <button
                  type="button"
                  onClick={handleAddVisura}
                  className="mt-4 w-full flex items-center justify-between gap-3 rounded-lg border border-[#4463EE]/30 bg-[#4463EE]/5 hover:bg-[#4463EE]/10 hover:border-[#4463EE] transition-colors p-4 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#4463EE] text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-lg">description</span>
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#002147]">Non conosci la rendita catastale?</div>
                      <div className="text-[12px] text-slate-500">Richiedi la visura catastale ufficiale in pochi minuti.</div>
                    </div>
                  </div>
                  <span className="flex-shrink-0 inline-flex items-center gap-1.5 bg-[#4463EE] text-white text-[11px] font-bold uppercase tracking-widest px-3 py-2 rounded-md">
                    5,90 € <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </button>
              )}
            </section>
          </div>

          {/* RISULTATI */}
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <h2 className="text-sm font-extrabold text-[#002147] mb-4 uppercase tracking-widest">Riepilogo costi</h2>

              {!result && (
                <p className="text-sm text-slate-500">Compila i campi per vedere la stima.</p>
              )}

              {result && (
                <div className="space-y-3">
                  {result.valoreCatastale !== null && (
                    <Row
                      label="Valore catastale"
                      tip={TOOLTIPS.valore}
                      tipKey="valore"
                      openTip={openTip}
                      setOpenTip={setOpenTip}
                      value={formatEur(result.valoreCatastale, 0)}
                      muted
                    />
                  )}
                  <Row
                    label={`Imposta di registro${tipoVenditore === 'privato' ? ` (${(result.aliquotaApplicata * 100).toFixed(0)}%)` : ' (fissa)'}`}
                    tip={TOOLTIPS.registro}
                    tipKey="registro"
                    openTip={openTip}
                    setOpenTip={setOpenTip}
                    value={formatEur(result.imposteRegistro)}
                  />
                  <Row
                    label="Imposta ipotecaria"
                    tip={TOOLTIPS.ipotecaria}
                    tipKey="ipo"
                    openTip={openTip}
                    setOpenTip={setOpenTip}
                    value={formatEur(result.impostaIpotecaria)}
                  />
                  <Row
                    label="Imposta catastale"
                    tip={TOOLTIPS.catastale}
                    tipKey="cat"
                    openTip={openTip}
                    setOpenTip={setOpenTip}
                    value={formatEur(result.impostaCatastale)}
                  />
                  {result.iva > 0 && (
                    <Row
                      label={`IVA (${(result.aliquotaApplicata * 100).toFixed(0)}%)`}
                      tip={TOOLTIPS.iva}
                      tipKey="iva"
                      openTip={openTip}
                      setOpenTip={setOpenTip}
                      value={formatEur(result.iva)}
                    />
                  )}
                  <div className="border-t border-slate-100 pt-3 mt-3">
                    <div className="bg-[#4463EE]/5 border border-[#4463EE]/20 rounded-lg p-3">
                      <div className="text-[10px] font-bold text-[#4463EE] uppercase tracking-widest mb-1">Totale costi accessori</div>
                      <div className="text-lg font-extrabold text-[#002147]">
                        {formatEur(result.totaleAccessori)}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Imposte e IVA. Onorario notarile escluso.</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed pt-2">
                    Calcolo orientativo basato sulla normativa vigente al 2026. Per il calcolo definitivo consultare il notaio incaricato.
                  </p>
                </div>
              )}
            </div>

            {result && (
              <Link
                href="/catalogo/documenti-catastali"
                onClick={handleBundleCta}
                className="mt-4 block bg-[#4463EE] text-white p-5 hover:bg-[#3753d4] transition-colors"
              >
                <div className="text-sm font-bold mb-1">Pronto a procedere con l&apos;acquisto?</div>
                <div className="text-[12px] text-white/80 mb-3">
                  Tutti i documenti ufficiali per la compravendita in un unico posto.
                </div>
                <div className="text-[11px] font-bold uppercase tracking-widest inline-flex items-center gap-1">
                  Esplora i documenti catastali <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </Link>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({
  label, value, tip, tipKey, openTip, setOpenTip, muted,
}: {
  label: string;
  value: string;
  tip: string;
  tipKey: string;
  openTip: string | null;
  setOpenTip: (k: string | null) => void;
  muted?: boolean;
}) {
  const isOpen = openTip === tipKey;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`text-sm ${muted ? 'text-slate-500' : 'text-[#002147]'} truncate`}>{label}</span>
          <button
            type="button"
            aria-label={`Info: ${label}`}
            onClick={() => setOpenTip(isOpen ? null : tipKey)}
            className="flex-shrink-0 w-4 h-4 rounded-full border border-slate-300 text-slate-400 text-[10px] leading-none hover:text-[#4463EE] hover:border-[#4463EE]"
          >
            ?
          </button>
        </div>
        <span className={`text-sm font-bold ${muted ? 'text-slate-500' : 'text-[#002147]'} text-right whitespace-nowrap`}>{value}</span>
      </div>
      {isOpen && (
        <p className="text-[11px] text-slate-500 bg-slate-50 rounded-md p-2 mt-1.5 leading-relaxed">{tip}</p>
      )}
    </div>
  );
}
