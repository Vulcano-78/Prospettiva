export interface ServiceField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'file';
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  longDescription?: string;
  price: number;
  category: string;
  categoryIcon: string;
  fields: ServiceField[];
  requiresDelegate?: boolean;
  isActive: boolean;
  isFeatured?: boolean;
  href?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: 'documenti-catastali',
    name: 'Catasto',
    description: 'Visure, planimetrie e analisi documentali ufficiali.',
    icon: 'assignment'
  },
  {
    id: 'verifiche-ipotecarie',
    name: 'Conservatoria',
    description: 'Ispezioni e controlli sulla presenza di gravami.',
    icon: 'search'
  },
  {
    id: 'urbanistica',
    name: 'Urbanistica & Conformita',
    description: 'Documentazione tecnica e asseverazioni.',
    icon: 'corporate_fare'
  },
  {
    id: 'marketing-ai',
    name: 'Marketing Immobiliare AI',
    description: 'Potenzia i tuoi annunci con l\'IA.',
    icon: 'auto_fix_high'
  },
  {
    id: 'strumenti-gratuiti',
    name: 'Strumenti Gratuiti',
    description: 'Calcolatori veloci e checklist.',
    icon: 'calculate'
  }
];

// Province e comuni sono ora caricati dinamicamente via /api/catasto/territorio
// I campi 'provincia' e 'comune' sono renderizzati con ProvinciaSelect / ComuneSelect
// (vedi src/components/forms e src/hooks/useTerritorio.ts).

const baseImmobileFields: ServiceField[] = [
  { name: 'provincia', label: 'Provincia', type: 'select', required: true },
  { name: 'comune', label: 'Comune', type: 'select', required: true },
  { name: 'foglio', label: 'Foglio', type: 'text', placeholder: 'Es. 42', required: true },
  { name: 'particella', label: 'Particella', type: 'text', placeholder: 'Es. 158', required: true },
];

const subalterno: ServiceField = { name: 'subalterno', label: 'Subalterno', type: 'text', placeholder: 'Es. 1' };
const emailField: ServiceField = { name: 'email', label: 'Email per la consegna', type: 'email', placeholder: 'nome@email.it', required: true };
const codiceFiscale: ServiceField = { name: 'codiceFiscale', label: 'Codice Fiscale', type: 'text', placeholder: 'RSSMRA85L01H501Z', required: true };

export const services: Service[] = [
  // DOCUMENTI CATASTALI
  {
    id: 'visura-catastale',
    slug: 'visura-catastale',
    name: 'Visura Catastale',
    shortName: 'Visura Catastale',
    description: 'Richiedi documenti ufficiali per soggetti o immobili, in formato sintetico o analitico.',
    longDescription: 'Richiedi il documento ufficiale dell\'Agenzia delle Entrate con la massima semplicita. Ricezione immediata via email.',
    price: 5.90,
    category: 'documenti-catastali',
    categoryIcon: 'description',
    isActive: true,
    fields: [...baseImmobileFields, subalterno, emailField]
  },
  {
    id: 'visura-catastale-storica',
    slug: 'visura-catastale-storica',
    name: 'Visura Catastale Storica',
    shortName: 'Visura Catastale Storica',
    description: 'Documenta tutte le variazioni catastali nel tempo.',
    price: 8.90,
    category: 'documenti-catastali',
    categoryIcon: 'history',
    isActive: true,
    fields: [...baseImmobileFields, subalterno, emailField]
  },
  {
    id: 'visura-per-soggetto',
    slug: 'visura-per-soggetto',
    name: 'Visura per Soggetto',
    shortName: 'Visura Soggetto',
    description: 'Elenco immobili intestati a una persona o societa.',
    price: 7.90,
    category: 'documenti-catastali',
    categoryIcon: 'person_search',
    isActive: true,
    fields: [
      codiceFiscale,
      { name: 'provincia', label: 'Provincia (opzionale)', type: 'select' },
      emailField
    ]
  },
  {
    id: 'visura-per-soggetto-storica',
    slug: 'visura-per-soggetto-storica',
    name: 'Visura per Soggetto Storica',
    shortName: 'Visura Soggetto Storica',
    description: 'Elenco storico degli immobili intestati a una persona o societa con tutte le variazioni nel tempo.',
    price: 10.90,
    category: 'documenti-catastali',
    categoryIcon: 'manage_search',
    isActive: true,
    fields: [
      codiceFiscale,
      { name: 'provincia', label: 'Provincia (opzionale)', type: 'select' },
      emailField
    ]
  },
  {
    id: 'estratto-mappa',
    slug: 'estratto-mappa',
    name: 'Estratto Mappa Catastale',
    shortName: 'Estratto Mappa',
    description: 'Identifica e localizza un immobile sul territorio, analizzando confini e confinanti.',
    price: 11.90,
    category: 'documenti-catastali',
    categoryIcon: 'map',
    isActive: true,
    fields: [
      { name: 'provincia', label: 'Provincia', type: 'select', required: true },
      { name: 'comune', label: 'Comune', type: 'select', required: true },
      { name: 'foglio', label: 'Foglio', type: 'text', placeholder: 'Es. 42', required: true },
      { name: 'particella', label: 'Particella', type: 'text', placeholder: 'Es. 158', required: true },
      emailField
    ]
  },
  {
    id: 'ricerca-nazionale',
    slug: 'ricerca-nazionale',
    name: 'Ricerca Nazionale',
    shortName: 'Ricerca Nazionale',
    description: "Accerta l'esistenza di immobili intestati a un soggetto in tutta Italia.",
    price: 4.90,
    category: 'documenti-catastali',
    categoryIcon: 'travel_explore',
    isActive: true,
    isFeatured: true,
    fields: [codiceFiscale, emailField]
  },
  {
    id: 'ricerca-persona',
    slug: 'ricerca-persona',
    name: 'Ricerca per Persona',
    shortName: 'Ricerca per Persona',
    description: 'Individua, a livello provinciale, tutti gli immobili intestati a un soggetto privato o giuridico.',
    price: 7.90,
    category: 'documenti-catastali',
    categoryIcon: 'person_pin',
    isActive: true,
    fields: [
      { name: 'provincia', label: 'Provincia', type: 'select', required: true },
      codiceFiscale,
      emailField
    ]
  },
  {
    id: 'ricerca-indirizzo',
    slug: 'ricerca-indirizzo',
    name: 'Ricerca per Indirizzo',
    shortName: 'Ricerca per Indirizzo',
    description: "Recupera l'elenco di tutti gli immobili presenti in un indirizzo, comprensivi di informazioni come zona censuaria, categoria, classe, consistenza e rendita.",
    price: 8.90,
    category: 'documenti-catastali',
    categoryIcon: 'location_on',
    isActive: true,
    fields: [
      { name: 'provincia', label: 'Provincia', type: 'select', required: true },
      { name: 'comune', label: 'Comune', type: 'select', required: true },
      { name: 'indirizzo', label: 'Indirizzo', type: 'text', placeholder: 'Via Roma 12', required: true },
      emailField
    ]
  },
  {
    id: 'prospetto-catastale',
    slug: 'prospetto-catastale',
    name: 'Prospetto Catastale',
    shortName: 'Prospetto',
    description: "Ottieni le caratteristiche di un'unità immobiliare e i relativi dati degli intestatari (denominazione, codice fiscale, tipo di proprietà e quota).",
    price: 7.90,
    category: 'documenti-catastali',
    categoryIcon: 'summarize',
    isActive: true,
    fields: [...baseImmobileFields, subalterno, emailField]
  },
  {
    id: 'elenco-immobili',
    slug: 'elenco-immobili',
    name: 'Elenco degli Immobili',
    shortName: 'Elenco Immobili',
    description: 'Accedi a dati catastali dettagliati su categoria, consistenza, rendita, a partire da tipologia di Catasto (Fabbricato o Terreno), Comune, Provincia, Foglio, Particella.',
    price: 9.90,
    category: 'documenti-catastali',
    categoryIcon: 'list_alt',
    isActive: true,
    fields: [
      { name: 'tipoCatasto', label: 'Tipo Catasto', type: 'select', options: ['Fabbricato', 'Terreno'], required: true },
      { name: 'provincia', label: 'Provincia', type: 'select', required: true },
      { name: 'comune', label: 'Comune', type: 'select', required: true },
      { name: 'foglio', label: 'Foglio', type: 'text', placeholder: 'Es. 42', required: true },
      { name: 'particella', label: 'Particella', type: 'text', placeholder: 'Es. 158', required: true },
      emailField
    ]
  },
  {
    id: 'planimetria',
    slug: 'planimetria',
    name: 'Planimetria Catastale',
    shortName: 'Planimetria',
    description: 'Ottieni il disegno tecnico depositato al catasto.',
    price: 14.90,
    category: 'documenti-catastali',
    categoryIcon: 'layers',
    isActive: true,
    requiresDelegate: true,
    fields: [
      ...baseImmobileFields,
      subalterno,
      emailField,
      { name: 'delega', label: 'Documento di delega', type: 'file', required: true }
    ]
  },
  {
    id: 'elaborato-planimetrico',
    slug: 'elaborato-planimetrico',
    name: 'Elaborato Planimetrico',
    shortName: 'Elaborato Planimetrico',
    description: 'Rappresentazione grafica del fabbricato con subalterni.',
    price: 12.90,
    category: 'documenti-catastali',
    categoryIcon: 'grid_on',
    isActive: true,
    fields: [
      { name: 'provincia', label: 'Provincia', type: 'select', required: true },
      { name: 'comune', label: 'Comune', type: 'select', required: true },
      { name: 'foglio', label: 'Foglio', type: 'text', placeholder: 'Es. 42', required: true },
      { name: 'particella', label: 'Particella', type: 'text', placeholder: 'Es. 158', required: true },
      emailField
    ]
  },

  // VERIFICHE IPOTECARIE
  {
    id: 'ispezione-ipotecaria-immobile',
    slug: 'ispezione-ipotecaria-immobile',
    name: 'Ispezione Ipotecaria per Immobile',
    shortName: 'Ispezione Ipotecaria Immobile',
    description: "Documento ufficiale dell'Agenzia delle Entrate con l'elenco delle formalità (trascrizioni, iscrizioni e annotazioni) registrate sull'immobile.",
    price: 29.90,
    category: 'verifiche-ipotecarie',
    categoryIcon: 'home_work',
    isActive: true,
    fields: [
      ...baseImmobileFields,
      subalterno,
      emailField,
    ],
  },
  {
    id: 'ispezione-ipotecaria',
    slug: 'ispezione-ipotecaria',
    name: 'Ispezione Ipotecaria per Soggetto',
    shortName: 'Ispezione Ipotecaria Soggetto',
    description: "Documento ufficiale dell'Agenzia delle Entrate con l'elenco delle formalità (trascrizioni, iscrizioni e annotazioni) a carico di un determinato soggetto.",
    price: 29.90,
    category: 'verifiche-ipotecarie',
    categoryIcon: 'language',
    isActive: true,
    fields: [
      { name: 'cf_piva', label: 'Codice Fiscale o Partita IVA', type: 'text', placeholder: 'RSSMRA85L01H501Z / 12345678901', required: true },
      emailField,
    ],
  },
  {
    id: 'ispezione-ipotecaria-nazionale',
    slug: 'ispezione-ipotecaria-nazionale',
    name: 'Ispezione Ipotecaria Nazionale',
    shortName: 'Ispezione Ipotecaria Nazionale',
    description: "Documento ufficiale dell'Agenzia delle Entrate con l'elenco delle formalità (trascrizioni, iscrizioni e annotazioni) a livello nazionale di un determinato soggetto.",
    price: 36.90,
    category: 'verifiche-ipotecarie',
    categoryIcon: 'travel_explore',
    isActive: true,
    fields: [
      { name: 'cf_piva', label: 'Codice Fiscale o Partita IVA', type: 'text', placeholder: 'RSSMRA85L01H501Z / 12345678901', required: true },
      emailField,
    ],
  },
  {
    id: 'elenco-note-ipotecarie',
    slug: 'elenco-note-ipotecarie',
    name: 'Ispezione Ipotecaria di una Singola Nota',
    shortName: 'Ispezione Ipotecaria di una Singola Nota',
    description: "Documento ufficiale dell'Agenzia delle Entrate con il dettaglio completo di una specifica formalità (Trascrizione, Iscrizione o Annotazione) a carico di un immobile o un soggetto.",
    price: 15.90,
    category: 'verifiche-ipotecarie',
    categoryIcon: 'fact_check',
    isActive: true,
    fields: [emailField],
  },

  // URBANISTICA
  {
    id: 'certificato-urbanistico',
    slug: 'certificato-urbanistico',
    name: 'Certificato Urbanistico',
    shortName: 'Cert. Urbanistico',
    description: 'Documento che attesta la destinazione d\'uso.',
    price: 39.90,
    category: 'urbanistica',
    categoryIcon: 'article',
    isActive: false,
    fields: [...baseImmobileFields, emailField]
  },
  {
    id: 'attestato-ape',
    slug: 'attestato-ape',
    name: 'Attestato APE',
    shortName: 'APE',
    description: 'Certificazione della prestazione energetica.',
    price: 89.00,
    category: 'urbanistica',
    categoryIcon: 'energy_savings_leaf',
    isActive: false,
    fields: [...baseImmobileFields, emailField]
  },

  // MARKETING AI
  {
    id: 'virtual-staging',
    slug: 'virtual-staging',
    name: 'Virtual Staging AI',
    shortName: 'Virtual Staging',
    description: 'Arreda virtualmente i tuoi immobili vuoti con l\'intelligenza artificiale.',
    price: 29.00,
    category: 'marketing-ai',
    categoryIcon: 'auto_fix_high',
    isActive: false,
    isFeatured: true,
    fields: [emailField]
  },

  // STRUMENTI GRATUITI
  {
    id: 'conto-economico',
    slug: 'conto-economico',
    name: 'Conto Economico',
    shortName: 'Conto Economico',
    description: 'Calcola costi, ricavi, utile, ROI e ROE di un\'operazione immobiliare.',
    price: 0,
    category: 'strumenti-gratuiti',
    categoryIcon: 'calculate',
    isActive: true,
    href: '/utility/conto-economico',
    fields: []
  },
  {
    id: 'calcolatore-costi-compravendita',
    slug: 'calcolatore-costi-compravendita',
    name: 'Calcolatore Costi Compravendita',
    shortName: 'Costi Compravendita',
    description: 'Imposte di registro, ipotecaria, catastale, IVA e notaio: stima in 30 secondi.',
    price: 0,
    category: 'strumenti-gratuiti',
    categoryIcon: 'request_quote',
    isActive: true,
    href: '/utility/calcolatore-costi-compravendita',
    fields: []
  },
  {
    id: 'calcolatore-imu',
    slug: 'calcolatore-imu',
    name: 'Calcolatore IMU',
    shortName: 'Calc. IMU',
    description: 'Calcola rapidamente l\'imposta municipale.',
    price: 0,
    category: 'strumenti-gratuiti',
    categoryIcon: 'calculate',
    isActive: true,
    fields: []
  },
  {
    id: 'checklist-mutuo',
    slug: 'checklist-mutuo',
    name: 'Checklist Mutuo',
    shortName: 'Checklist',
    description: 'Elenco documenti necessari per il finanziamento.',
    price: 0,
    category: 'strumenti-gratuiti',
    categoryIcon: 'checklist',
    isActive: true,
    fields: []
  }
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(s => s.slug === slug);
}

export function getServicesByCategory(categoryId: string): Service[] {
  return services.filter(s => s.category === categoryId);
}

export function getActiveServices(): Service[] {
  return services.filter(s => s.isActive);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}
