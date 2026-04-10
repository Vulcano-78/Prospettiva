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

export const provinces = [
  'Agrigento', 'Alessandria', 'Ancona', 'Aosta', 'Arezzo', 'Ascoli Piceno', 'Asti', 'Avellino',
  'Bari', 'Barletta-Andria-Trani', 'Belluno', 'Benevento', 'Bergamo', 'Biella', 'Bologna', 'Bolzano',
  'Brescia', 'Brindisi', 'Cagliari', 'Caltanissetta', 'Campobasso', 'Caserta', 'Catania', 'Catanzaro',
  'Chieti', 'Como', 'Cosenza', 'Cremona', 'Crotone', 'Cuneo', 'Enna', 'Fermo', 'Ferrara', 'Firenze',
  'Foggia', 'Forli-Cesena', 'Frosinone', 'Genova', 'Gorizia', 'Grosseto', 'Imperia', 'Isernia',
  'La Spezia', 'L\'Aquila', 'Latina', 'Lecce', 'Lecco', 'Livorno', 'Lodi', 'Lucca', 'Macerata',
  'Mantova', 'Massa-Carrara', 'Matera', 'Messina', 'Milano', 'Modena', 'Monza e Brianza', 'Napoli',
  'Novara', 'Nuoro', 'Oristano', 'Padova', 'Palermo', 'Parma', 'Pavia', 'Perugia', 'Pesaro e Urbino',
  'Pescara', 'Piacenza', 'Pisa', 'Pistoia', 'Pordenone', 'Potenza', 'Prato', 'Ragusa', 'Ravenna',
  'Reggio Calabria', 'Reggio Emilia', 'Rieti', 'Rimini', 'Roma', 'Rovigo', 'Salerno', 'Sassari',
  'Savona', 'Siena', 'Siracusa', 'Sondrio', 'Sud Sardegna', 'Taranto', 'Teramo', 'Terni', 'Torino',
  'Trapani', 'Trento', 'Treviso', 'Trieste', 'Udine', 'Varese', 'Venezia', 'Verbano-Cusio-Ossola',
  'Vercelli', 'Verona', 'Vibo Valentia', 'Vicenza', 'Viterbo'
];

const baseImmobileFields: ServiceField[] = [
  { name: 'provincia', label: 'Provincia', type: 'select', options: provinces, required: true },
  { name: 'comune', label: 'Comune', type: 'text', placeholder: 'Es. Roma', required: true },
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
    description: 'Richiedi documenti ufficiali per soggetti o immobili.',
    longDescription: 'Richiedi il documento ufficiale dell\'Agenzia delle Entrate con la massima semplicita. Ricezione immediata via email.',
    price: 9.90,
    category: 'documenti-catastali',
    categoryIcon: 'description',
    isActive: true,
    fields: [...baseImmobileFields, subalterno, emailField]
  },
  {
    id: 'visura-catastale-storica',
    slug: 'visura-catastale-storica',
    name: 'Visura Catastale Storica',
    shortName: 'Visura Storica',
    description: 'Documenta tutte le variazioni catastali nel tempo.',
    price: 12.90,
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
    price: 14.90,
    category: 'documenti-catastali',
    categoryIcon: 'person_search',
    isActive: true,
    fields: [
      codiceFiscale,
      { name: 'provincia', label: 'Provincia (opzionale)', type: 'select', options: ['Tutte le province', ...provinces] },
      emailField
    ]
  },
  {
    id: 'estratto-mappa',
    slug: 'estratto-mappa',
    name: 'Estratto Mappa Catastale',
    shortName: 'Estratto Mappa',
    description: 'Identifica e localizza un immobile sul territorio.',
    price: 12.50,
    category: 'documenti-catastali',
    categoryIcon: 'map',
    isActive: true,
    fields: [
      { name: 'provincia', label: 'Provincia', type: 'select', options: provinces, required: true },
      { name: 'comune', label: 'Comune', type: 'text', placeholder: 'Es. Roma', required: true },
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
    description: 'Accerta l\'esistenza di immobili intestati a un soggetto in tutta Italia.',
    price: 18.00,
    category: 'documenti-catastali',
    categoryIcon: 'travel_explore',
    isActive: true,
    isFeatured: true,
    fields: [codiceFiscale, emailField]
  },
  {
    id: 'ricerca-persona',
    slug: 'ricerca-persona',
    name: 'Ricerca Persona',
    shortName: 'Ricerca Persona',
    description: 'Ricerca immobili intestati a un soggetto in una provincia.',
    price: 14.90,
    category: 'documenti-catastali',
    categoryIcon: 'person_pin',
    isActive: true,
    fields: [
      { name: 'provincia', label: 'Provincia', type: 'select', options: provinces, required: true },
      codiceFiscale,
      emailField
    ]
  },
  {
    id: 'ricerca-indirizzo',
    slug: 'ricerca-indirizzo',
    name: 'Ricerca per Indirizzo',
    shortName: 'Ricerca Indirizzo',
    description: 'Trova i dati catastali partendo dall\'indirizzo.',
    price: 9.90,
    category: 'documenti-catastali',
    categoryIcon: 'location_on',
    isActive: true,
    fields: [
      { name: 'provincia', label: 'Provincia', type: 'select', options: provinces, required: true },
      { name: 'comune', label: 'Comune', type: 'text', placeholder: 'Es. Roma', required: true },
      { name: 'indirizzo', label: 'Indirizzo', type: 'text', placeholder: 'Via Roma 12', required: true },
      emailField
    ]
  },
  {
    id: 'prospetto-catastale',
    slug: 'prospetto-catastale',
    name: 'Prospetto Catastale',
    shortName: 'Prospetto',
    description: 'Riepilogo sintetico dei dati catastali.',
    price: 9.90,
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
    description: 'Lista completa degli immobili per foglio e particella.',
    price: 9.90,
    category: 'documenti-catastali',
    categoryIcon: 'list_alt',
    isActive: true,
    fields: [
      { name: 'tipoCatasto', label: 'Tipo Catasto', type: 'select', options: ['Fabbricato', 'Terreno'], required: true },
      { name: 'provincia', label: 'Provincia', type: 'select', options: provinces, required: true },
      { name: 'comune', label: 'Comune', type: 'text', placeholder: 'Es. Roma', required: true },
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
    shortName: 'Elaborato Plan.',
    description: 'Rappresentazione grafica del fabbricato con subalterni.',
    price: 19.90,
    category: 'documenti-catastali',
    categoryIcon: 'grid_on',
    isActive: true,
    fields: [
      { name: 'provincia', label: 'Provincia', type: 'select', options: provinces, required: true },
      { name: 'comune', label: 'Comune', type: 'text', placeholder: 'Es. Roma', required: true },
      { name: 'foglio', label: 'Foglio', type: 'text', placeholder: 'Es. 42', required: true },
      { name: 'particella', label: 'Particella', type: 'text', placeholder: 'Es. 158', required: true },
      emailField
    ]
  },

  // VERIFICHE IPOTECARIE
  {
    id: 'visura-ipotecaria',
    slug: 'visura-ipotecaria',
    name: 'Visura Ipotecaria',
    shortName: 'Visura Ipotecaria',
    description: 'Verifica la presenza di trascrizioni o annotazioni.',
    price: 19.90,
    category: 'verifiche-ipotecarie',
    categoryIcon: 'fact_check',
    isActive: true,
    fields: [
      { name: 'tipoRicerca', label: 'Tipo Ricerca', type: 'select', options: ['Per soggetto', 'Per immobile'], required: true },
      { name: 'provincia', label: 'Provincia', type: 'select', options: provinces, required: true },
      codiceFiscale,
      emailField
    ]
  },
  {
    id: 'ispezione-nazionale',
    slug: 'ispezione-nazionale',
    name: 'Ispezione Nazionale',
    shortName: 'Ispezione Naz.',
    description: 'Analisi completa in tutte le conservatorie d\'Italia.',
    price: 49.90,
    category: 'verifiche-ipotecarie',
    categoryIcon: 'language',
    isActive: false,
    fields: [codiceFiscale, emailField]
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
