import { FC, useEffect, useState } from 'react';
import { Download, Eye, BookOpen } from 'lucide-react';
import { ensureBaseNetwork, ensureMerchantAddress } from '../lib/wallet';
import { getSupabase } from '../lib/supabase';

interface NoteItem {
  name: string;
  url: string;
  size: number;
  priceEth: string; // string in ETH
}

const FeaturedNotes: FC = () => {
  const [items, setItems] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [buying, setBuying] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const supabase = getSupabase();
        const { data, error } = await supabase.storage.from('notes').list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
        if (error) throw error;
        const mapped: NoteItem[] = (data || [])
          .filter((f: any) => !f.name.endsWith('/'))
          .map((f: any) => {
            const { data: urlData } = supabase.storage.from('notes').getPublicUrl(f.name);
            // filename convention: <priceEth>__<title>__<original>
            const [priceEthMaybe, titleMaybe] = (f.name || '').split('__');
            const priceEth = /^\d+(\.\d+)?$/.test(priceEthMaybe) ? priceEthMaybe : '0.01';
            return { name: titleMaybe || f.name, url: urlData.publicUrl, size: f.metadata?.size || 0, priceEth };
          });
        setItems(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleBuy = async (item: NoteItem) => {
    try {
      const ethereum = (window as any).ethereum as { request?: (args: any) => Promise<any> } | undefined;
      if (!ethereum) {
        alert('MetaMask non rilevato.');
        return;
      }
      await ensureBaseNetwork();
      const to = ensureMerchantAddress();
      const confirm = window.confirm(`Confermi l'acquisto di "${item.name}" per ${item.priceEth} ETH?`);
      if (!confirm) return;
      // Convert ETH string to hex wei
      const wei = BigInt(Math.round(parseFloat(item.priceEth) * 1e18)).toString(16);
      await ethereum.request?.({
        method: 'eth_sendTransaction',
        params: [{ to, value: '0x' + wei }]
      });
      alert('Pagamento inviato! Puoi scaricare la nota.');
      window.open(item.url, '_blank');
    } catch (e) {
      console.error(e);
      alert('Acquisto annullato o fallito.');
    } finally {
      setBuying(null);
    }
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Note in Evidenza
          </h2>
          <p className="text-slate-600">Note reali dal bucket Supabase</p>
        </div>
        <button className="hidden md:block bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-full font-medium hover:border-blue-400 hover:text-blue-600 transition-all">
          Vedi Tutti
        </button>
      </div>

      {loading && <div className="text-slate-600">Caricamento…</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((note) => (
          <div key={note.url} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-slate-200">
            <div className="relative">
              <div className="w-full h-48 bg-slate-100 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-slate-500" />
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                  {(note.size / 1024 / 1024).toFixed(1)} MB
                </span>
                <span className="text-2xl font-bold text-slate-800">{note.priceEth} ETH</span>
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {note.name}
              </h3>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  <Download className="w-3 h-3" />
                  <span>Scarica immediato</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  <Eye className="w-3 h-3" />
                  <a className="underline" href={note.url} target="_blank" rel="noreferrer">Anteprima</a>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleBuy(note)}
                  disabled={buying === note.url}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-60">
                  {buying === note.url ? 'Acquisto…' : 'Acquista'}
                </button>
                <a href={note.url} target="_blank" rel="noreferrer" className="px-4 py-3 border border-slate-300 rounded-xl text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all">
                  <Eye className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !loading && (
        <div className="text-slate-600">Nessuna nota trovata. Caricane una dalla sezione Upload.</div>
      )}
    </section>
  );
};

export default FeaturedNotes;