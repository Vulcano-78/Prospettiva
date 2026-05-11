// Mapping slug + varianti → label leggibile in italiano per le email n8n.
// Source of truth: usato sia da /api/process-order (webhook payload + arricchimento items[] in DB)
// sia dalla dashboard se servirà unificare l'etichetta.

export type OrderItemForLabel = {
  slug: string
  formData?: Record<string, string>
}

export function buildTipoServizioLabel(item: OrderItemForLabel): string {
  const fd = item.formData ?? {}
  // _searchType è usato dalle visure, _mode dalle ispezioni e singola nota.
  // Valori possibili: 'immobile' | 'soggetto' | 'soggetto-giuridico'.
  const searchType = fd._searchType || fd._mode || 'immobile'
  const isSubject = searchType === 'soggetto' || searchType === 'soggetto-giuridico'

  switch (item.slug) {
    // CATASTO — visure (4 varianti: per immobile/soggetto × ordinaria/storica)
    case 'visura-catastale':
      return isSubject ? 'Visura Catastale per Soggetto' : 'Visura Catastale per Immobile'
    case 'visura-catastale-storica':
      return isSubject ? 'Visura Catastale per Soggetto Storica' : 'Visura Catastale per Immobile Storica'

    // CATASTO — legacy slug separati (compatibilità retro, non in uso attivo)
    case 'visura-per-soggetto':
      return 'Visura Catastale per Soggetto'
    case 'visura-per-soggetto-storica':
      return 'Visura Catastale per Soggetto Storica'

    // CATASTO — documenti
    case 'estratto-mappa':
      return 'Estratto di Mappa'
    case 'elaborato-planimetrico':
      return 'Elaborato Planimetrico'
    case 'prospetto-catastale':
      return 'Prospetto Catastale'
    case 'planimetria':
      return 'Planimetria Catastale'
    case 'elenco-immobili':
      return 'Elenco degli Immobili'

    // CATASTO — ricerche
    case 'ricerca-indirizzo':
      return 'Ricerca per Indirizzo'
    case 'ricerca-persona':
      return 'Ricerca per Persona'
    case 'ricerca-nazionale':
      return 'Ricerca Nazionale'

    // CONSERVATORIA — ispezioni ipotecarie
    case 'ispezione-ipotecaria':
      return isSubject ? 'Ispezione Ipotecaria per Soggetto' : 'Ispezione Ipotecaria per Immobile'
    case 'ispezione-ipotecaria-immobile':
      return 'Ispezione Ipotecaria per Immobile'
    case 'ispezione-ipotecaria-nazionale':
      return 'Ispezione Ipotecaria Nazionale'
    case 'elenco-note-ipotecarie':
      return 'Ispezione Ipotecaria di una Singola Nota'

    default:
      // Fallback: lo slug stesso. Se vedi questo in produzione → aggiungi un caso esplicito.
      return item.slug
  }
}
