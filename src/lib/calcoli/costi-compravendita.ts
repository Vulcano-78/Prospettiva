// Logica di calcolo costi compravendita immobiliare (normativa 2026, IT).
// Funzioni pure, testabili. Nessuna dipendenza UI.

export type TipoVenditore = 'privato' | 'impresa';
export type Destinazione = 'prima_casa' | 'seconda_casa';
export type CategoriaCatastale =
  | 'A/2' | 'A/3' | 'A/4' | 'A/5' | 'A/6' | 'A/7' | 'A/11'
  | 'C/2' | 'C/6' | 'C/7'
  | 'A/1' | 'A/8' | 'A/9';

export const CATEGORIE_STANDARD: CategoriaCatastale[] = ['A/2', 'A/3', 'A/4', 'A/5', 'A/6', 'A/7', 'A/11', 'C/2', 'C/6', 'C/7'];
export const CATEGORIE_LUSSO: CategoriaCatastale[] = ['A/1', 'A/8', 'A/9'];

export interface InputCompravendita {
  tipoVenditore: TipoVenditore;
  destinazione: Destinazione;
  categoria: CategoriaCatastale;
  prezzo: number;
  rendita?: number; // richiesta solo se tipoVenditore = 'privato'
}

export interface RisultatoCompravendita {
  imposteRegistro: number;
  impostaIpotecaria: number;
  impostaCatastale: number;
  iva: number;
  valoreCatastale: number | null; // solo caso privato
  totaleImposte: number;
  totaleAccessori: number; // imposte + IVA
  aliquotaApplicata: number; // pct effettiva (registro per privato, IVA per impresa)
  agevolazionePrimaCasaApplicata: boolean;
}

export function isLusso(cat: CategoriaCatastale): boolean {
  return CATEGORIE_LUSSO.includes(cat);
}

export function calcolaCostiCompravendita(input: InputCompravendita): RisultatoCompravendita {
  const lusso = isLusso(input.categoria);
  // L'agevolazione prima casa non si applica mai sulle categorie di lusso.
  const primaCasaEffettiva = input.destinazione === 'prima_casa' && !lusso;

  let imposteRegistro = 0;
  let impostaIpotecaria = 0;
  let impostaCatastale = 0;
  let iva = 0;
  let valoreCatastale: number | null = null;
  let aliquotaApplicata = 0;

  if (input.tipoVenditore === 'privato') {
    const rendita = input.rendita ?? 0;
    const moltiplicatore = primaCasaEffettiva ? 115.5 : 126;
    valoreCatastale = rendita * moltiplicatore;
    const pct = primaCasaEffettiva ? 0.02 : 0.09;
    aliquotaApplicata = pct;
    imposteRegistro = Math.max(valoreCatastale * pct, 1000);
    impostaIpotecaria = 50;
    impostaCatastale = 50;
    iva = 0;
  } else {
    // impresa con IVA
    const ivaPct = lusso ? 0.22 : (input.destinazione === 'prima_casa' ? 0.04 : 0.10);
    aliquotaApplicata = ivaPct;
    iva = input.prezzo * ivaPct;
    imposteRegistro = 200;
    impostaIpotecaria = 200;
    impostaCatastale = 200;
  }

  const totaleImposte = imposteRegistro + impostaIpotecaria + impostaCatastale;
  const totaleAccessori = totaleImposte + iva;

  return {
    imposteRegistro,
    impostaIpotecaria,
    impostaCatastale,
    iva,
    valoreCatastale,
    totaleImposte,
    totaleAccessori,
    aliquotaApplicata,
    agevolazionePrimaCasaApplicata: primaCasaEffettiva,
  };
}

export function formatEur(n: number, decimals: 0 | 2 = 2): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

/* ------------------------------------------------------------------ *
 * Test cases (commenti — esecuzione manuale o in jest in futuro)     *
 * ------------------------------------------------------------------ *
 * 1) Prima casa privato, rendita 450, categoria A/3, prezzo 200000
 *    → valore catastale 51.975 ; registro 1.039,50 ; totale imposte 1.139,50
 *
 * 2) Seconda casa privato, rendita 800, categoria A/3, prezzo 250000
 *    → valore catastale 100.800 ; registro 9.072 ; totale imposte 9.172
 *
 * 3) Prima casa impresa, prezzo 250000, categoria A/3
 *    → IVA 10.000 ; registro/ipo/cat 200 ciascuna ; totale imposte 600
 *
 * 4) Lusso A/1 impresa, prezzo 1.000.000, destinazione prima_casa
 *    → IVA 220.000 (agevolazione non applicabile su lusso) ; imposte 200×3
 *
 * 5) Prima casa privato, rendita 300, categoria A/3
 *    → valore catastale 34.650 ; calcolo darebbe 693 ma viene applicato il minimo 1.000
 * ------------------------------------------------------------------ */
