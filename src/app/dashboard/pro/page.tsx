'use client';

import Link from 'next/link';


const mockOrders = [
  { id: 1, date: '12/08/2023', client: 'Innovazione S.p.A.', piva: '0123456789', services: 'Asset Digitali, Consulenza AI', total: 2450.00, status: 'paid' },
  { id: 2, date: '10/08/2023', client: 'Studio Legale Bianchi', piva: '9876543210', services: 'Audit Cyber, Training', total: 1100.00, status: 'pending' },
  { id: 3, date: '05/08/2023', client: 'Rossi Costruzioni', piva: '4455667788', services: 'Software ERP, Setup Cloud', total: 5200.00, status: 'expired' },
];

export default function DashboardProPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col py-8 px-6 bg-gradient-to-b from-white to-slate-50 border-r border-slate-100">
          <div className="mb-10">
            <Link href="/" className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="text-[#002147]">Prospettiva</span>
              <span className="text-[#4463ee]">.io</span>
            </Link>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Professional Suite</span>
          </div>

          <nav className="flex-1 space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#002147] font-semibold bg-white shadow-sm rounded-xl border-r-2 border-[#4463ee]">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm font-semibold">Dashboard</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 font-medium hover:text-[#002147] hover:bg-slate-100 rounded-xl transition-colors">
              <span className="material-symbols-outlined">description</span>
              <span className="text-sm font-semibold">Documenti</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 font-medium hover:text-[#002147] hover:bg-slate-100 rounded-xl transition-colors">
              <span className="material-symbols-outlined">person</span>
              <span className="text-sm font-semibold">Dati Personali</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 font-medium hover:text-[#002147] hover:bg-slate-100 rounded-xl transition-colors">
              <span className="material-symbols-outlined">payments</span>
              <span className="text-sm font-semibold">Metodi di Pagamento</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 font-medium hover:text-[#002147] hover:bg-slate-100 rounded-xl transition-colors">
              <span className="material-symbols-outlined">receipt_long</span>
              <span className="text-sm font-semibold">Fatture</span>
            </a>
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100 space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-500 font-medium hover:text-[#002147] transition-colors">
              <span className="material-symbols-outlined">settings</span>
              <span className="text-sm">Impostazioni</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-500 font-medium hover:text-[#002147] transition-colors">
              <span className="material-symbols-outlined">contact_support</span>
              <span className="text-sm">Supporto</span>
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 space-y-10">
          {/* Hero CTA */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#002147] to-[#00325a] p-8 md:p-10 text-white shadow-xl">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Potenzia la tua consulenza con strumenti digitali avanzati.
              </h2>
              <p className="text-blue-200 text-base mb-6 leading-relaxed">
                Configura pacchetti servizi, invia preventivi interattivi e gestisci i pagamenti dei tuoi clienti in un&apos;unica piattaforma.
              </p>
              <Link
                href="/pro/prepara-ordine"
                className="inline-flex items-center gap-2 bg-[#4463ee] text-white font-bold px-6 py-3 rounded-xl hover:brightness-110 transition-all shadow-lg"
              >
                Prepara un ordine per un cliente
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </section>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Totale Ordini</p>
              <p className="text-3xl font-extrabold text-[#002147]">124</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +12% questo mese
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Fatturato Netto</p>
              <p className="text-3xl font-extrabold text-[#002147]">&euro;12.450</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +5% vs media
              </div>
            </div>
            <div className="md:col-span-2 bg-[#002147] p-6 rounded-xl shadow-lg text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-70 mb-2">Prossima Scadenza</p>
                <p className="text-lg font-bold">Fatturazione Trimestrale</p>
                <p className="text-sm opacity-80">15 Settembre 2026</p>
              </div>
              <div className="bg-white/10 p-3 rounded-full">
                <span className="material-symbols-outlined text-2xl">event_upcoming</span>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <section>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>Ordini inviati ai clienti</h3>
                <p className="text-slate-500 text-sm mt-1">Gestisci e monitora le proposte inviate.</p>
              </div>
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                <button className="px-4 py-2 rounded-lg bg-white shadow-sm text-xs font-bold text-[#002147]">Tutti</button>
                <button className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-white/50">Pagati</button>
                <button className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-white/50">In attesa</button>
                <button className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-white/50">Scaduti</button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Data</th>
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Cliente</th>
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Servizi</th>
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-right">Totale</th>
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">Stato</th>
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mockOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-5 text-sm font-medium text-[#002147]">{order.date}</td>
                      <td className="px-6 py-5">
                        <div>
                          <span className="text-sm font-bold text-[#002147]">{order.client}</span>
                          <span className="block text-[11px] text-slate-500">P.IVA {order.piva}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-500 italic">{order.services}</td>
                      <td className="px-6 py-5 text-sm font-bold text-[#002147] text-right">&euro; {order.total.toFixed(2)}</td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          order.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'paid' ? 'Pagato' : order.status === 'pending' ? 'In attesa' : 'Scaduto'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 hover:bg-[#002147]/5 rounded-lg text-[#002147]" title="Scarica">
                            <span className="material-symbols-outlined text-lg">download</span>
                          </button>
                          <button className="p-1.5 hover:bg-[#002147]/5 rounded-lg text-[#002147]" title="Copia link">
                            <span className="material-symbols-outlined text-lg">content_copy</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Business Data + Invoices */}
          <div className="grid lg:grid-cols-2 gap-8">
            <section className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#002147] shadow-sm">
                    <span className="material-symbols-outlined">business</span>
                  </div>
                  <h4 className="text-lg font-extrabold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>Dati aziendali</h4>
                </div>
                <button className="text-xs font-bold text-[#002147] underline underline-offset-4 hover:text-[#4463ee]">Modifica</button>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Ragione Sociale</p>
                  <p className="text-sm font-semibold text-[#002147]">Valeri &amp; Associati Consulting</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Partita IVA</p>
                  <p className="text-sm font-semibold text-[#002147]">IT 01234567890</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Sede Legale</p>
                  <p className="text-sm font-semibold text-[#002147]">Via del Corso 12, 00186 Roma (RM)</p>
                </div>
              </div>
            </section>

            <section className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#002147] shadow-sm">
                    <span className="material-symbols-outlined">receipt</span>
                  </div>
                  <h4 className="text-lg font-extrabold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>Ultime Fatture</h4>
                </div>
                <button className="text-xs font-bold text-[#002147] underline underline-offset-4 hover:text-[#4463ee]">Vedi tutte</button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl hover:bg-white/80 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#002147]/40">picture_as_pdf</span>
                    <div>
                      <p className="text-sm font-bold text-[#002147]">Fattura #PRO-2026-08</p>
                      <p className="text-[10px] text-slate-500">01/08/2026 - Abbonamento Suite</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#002147]">&euro; 290,00</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl hover:bg-white/80 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#002147]/40">picture_as_pdf</span>
                    <div>
                      <p className="text-sm font-bold text-[#002147]">Fattura #PRO-2026-07</p>
                      <p className="text-[10px] text-slate-500">01/07/2026 - Abbonamento Suite</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#002147]">&euro; 290,00</span>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

    </div>
  );
}
