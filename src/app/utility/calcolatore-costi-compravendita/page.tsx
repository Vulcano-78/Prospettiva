import type { Metadata } from 'next';
import CostiCompravenditaCalculator from '@/components/tools/CostiCompravenditaCalculator';

export const metadata: Metadata = {
  title: 'Calcolatore Costi Compravendita Immobiliare 2026 | Prospettiva',
  description: "Calcola in 30 secondi tutti i costi accessori dell'acquisto di una casa: imposta di registro, ipotecaria, catastale, IVA, notaio. Gratis.",
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Calcolatore Costi Compravendita Immobiliare',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  url: 'https://prospettiva.io/utility/calcolatore-costi-compravendita',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  description: "Strumento gratuito per stimare imposta di registro, ipotecaria, catastale, IVA e notaio nell'acquisto di un immobile in Italia.",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CostiCompravenditaCalculator />
    </>
  );
}
