'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const mockDocuments = [
  { id: 'ORD-98234', name: 'Visura Camerale Ordinaria', date: '12 Ott 2023', status: 'completed', price: 18.50 },
  { id: 'ORD-98241', name: 'Planimetria Catastale', date: '24 Ott 2023', status: 'processing', price: 24.00 },
  { id: 'ORD-98245', name: 'Certificato di Residenza', date: '28 Ott 2023', status: 'completed', price: 12.00 },
];

const mockInvoices = [
  { id: 'FAT-2023-012', date: '15 Ott 2023', amount: 18.50, status: 'paid' },
  { id: 'FAT-2023-011', date: '02 Ott 2023', amount: 45.00, status: 'paid' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col py-8 px-6 bg-gradient-to-b from-white to-slate-50 border-r border-slate-100">
          <div className="mb-10">
            <Link href="/" className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="text-[#002147]">Prospettiva</span>
              <span className="text-[#4463ee]">.io</span>
            </Link>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Area Personale</span>
          </div>

          <nav className="flex-1 space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 font-medium hover:text-[#002147] hover:bg-slate-100 rounded-xl transition-colors">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm font-semibold">Dashboard</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#002147] font-semibold bg-white shadow-sm rounded-xl border-r-2 border-[#4463ee]">
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
            <Link href="/" className="mt-4 block w-full bg-[#4463ee] text-white font-bold py-3 rounded-xl text-center text-sm hover:brightness-110 transition-all">
              Nuovo Ordine
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 max-w-6xl">
          {/* Documents Section */}
          <section className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-[#002147] tracking-tight mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  I miei documenti
                </h2>
                <p className="text-slate-500 text-sm">Gestisci i tuoi documenti e segui lo stato delle pratiche.</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button className="px-4 py-2 text-xs font-bold rounded-lg bg-white shadow-sm text-[#002147]">Tutti</button>
                <button className="px-4 py-2 text-xs font-bold rounded-lg text-slate-500 hover:text-[#002147]">Completati</button>
                <button className="px-4 py-2 text-xs font-bold rounded-lg text-slate-500 hover:text-[#002147]">In elaborazione</button>
              </div>
            </div>

            <div className="space-y-3">
              {mockDocuments.map(doc => (
                <div key={doc.id} className="bg-white p-5 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${doc.status === 'completed' ? 'bg-blue-50 text-[#002147]' : 'bg-amber-50 text-amber-600'}`}>
                      <span className="material-symbols-outlined">{doc.status === 'completed' ? 'description' : 'pending_actions'}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#002147]">{doc.name}</h3>
                      <p className="text-xs text-slate-500">ID: #{doc.id} - {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="hidden md:block">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Stato</p>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        doc.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {doc.status === 'completed' ? 'Completato' : 'In elaborazione'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Prezzo</p>
                      <p className="font-bold text-[#002147]">&euro; {doc.price.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className={`p-2 rounded-lg transition-colors ${doc.status === 'completed' ? 'bg-slate-100 text-[#002147] hover:bg-[#002147] hover:text-white' : 'bg-slate-50 text-slate-300 cursor-not-allowed'}`} disabled={doc.status !== 'completed'}>
                        <span className="material-symbols-outlined">download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Grid: Personal Data + Payment Methods */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Personal Data */}
            <section className="bg-white rounded-xl p-6 border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-extrabold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>Dati Personali</h2>
                <button className="text-xs font-bold text-[#002147] underline underline-offset-4 hover:text-[#4463ee]">Modifica</button>
              </div>
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Nome e Cognome</p>
                  <p className="font-semibold text-[#002147]">Marco Rossi</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Codice Fiscale</p>
                  <p className="font-semibold text-[#002147]">RSSMRC85L01H501Z</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Email</p>
                  <p className="font-semibold text-[#002147]">marco.rossi@email.it</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Telefono</p>
                  <p className="font-semibold text-[#002147]">+39 333 1234567</p>
                </div>
              </div>
            </section>

            {/* Payment Methods */}
            <section className="bg-white rounded-xl p-6 border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-extrabold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>Metodi di Pagamento</h2>
                <button className="text-xs font-bold text-[#002147] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">Aggiungi</button>
              </div>
              <div className="space-y-3">
                <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-[#002147] rounded flex items-center justify-center text-white text-[8px] font-bold">VISA</div>
                    <div>
                      <p className="font-bold text-[#002147]">Visa Classica &bull;&bull;&bull;&bull; 4242</p>
                      <p className="text-[10px] text-slate-500">Scade 12/2025 - Primario</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Invoices */}
          <section>
            <h2 className="text-lg font-extrabold text-[#002147] mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>Fatture e Ricevute</h2>
            <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">N. Fattura</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Data Emissione</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Importo</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Stato</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Azione</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockInvoices.map(inv => (
                    <tr key={inv.id}>
                      <td className="px-6 py-4 text-sm font-bold text-[#002147]">{inv.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{inv.date}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#002147]">&euro; {inv.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="flex items-center gap-1.5 text-green-700 font-semibold">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Pagata
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[#002147] hover:text-[#4463ee]">
                          <span className="material-symbols-outlined">picture_as_pdf</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
