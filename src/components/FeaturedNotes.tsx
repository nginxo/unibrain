import { FC, useEffect, useState } from 'react';
import { Download, Eye, BookOpen, ShoppingCart, DollarSign } from 'lucide-react';
import { Document } from '../types/database';
import { useAuth } from '../hooks/useAuth';
import { paymentService } from '../services/paymentService';
import { database } from '../services/databaseAdapter';

const FeaturedNotes: FC = () => {
  const { walletAddress, isAuthenticated } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [buying, setBuying] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await database.getDocuments(12, 0);
      setDocuments(data);
    } catch (e) {
      console.error('Error loading documents:', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (document: Document) => {
    if (!isAuthenticated || !walletAddress) {
      alert('Connetti il wallet per acquistare.');
      return;
    }

    setBuying(document.id);
    try {
      const result = await paymentService.purchaseDocument(document, walletAddress);
      if (result.success) {
        alert('Acquisto completato! Puoi scaricare il documento.');
        window.open(document.file_url, '_blank');
        loadDocuments(); // Refresh to update stats
      } else {
        alert(`Acquisto fallito: ${result.error}`);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Errore durante l\'acquisto. Riprova.');
    } finally {
      setBuying(null);
    }
  };

  const handleFreeDownload = async (document: Document) => {
    if (!isAuthenticated || !walletAddress) {
      alert('Connetti il wallet per scaricare.');
      return;
    }

    try {
      const success = await paymentService.downloadForFree(document.id, walletAddress);
      if (success) {
        window.open(document.file_url, '_blank');
        loadDocuments(); // Refresh to update stats
      } else {
        alert('Download fallito. Riprova.');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Errore durante il download. Riprova.');
    }
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Marketplace Documenti
          </h2>
          <p className="text-slate-600">Scopri e acquista i migliori appunti universitari</p>
        </div>
        <button className="hidden md:block bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-full font-medium hover:border-blue-400 hover:text-blue-600 transition-all">
          Vedi Tutti
        </button>
      </div>

      {loading && <div className="text-slate-600">Caricamento documenti…</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-slate-200">
            <div className="relative">
              <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-white text-slate-700 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                  {doc.subject}
                </span>
              </div>
              {doc.is_free ? (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  GRATIS
                </div>
              ) : (
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {doc.price_eth} ETH
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                  {(doc.file_size / 1024 / 1024).toFixed(1)} MB
                </span>
                <div className="text-right">
                  <div className="text-xs text-slate-500">
                    {doc.downloads_count} downloads
                  </div>
                  {!doc.is_free && (
                    <div className="text-xs text-slate-500">
                      {doc.purchases_count} purchases
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {doc.title}
              </h3>

              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                {doc.description}
              </p>

              <div className="flex items-center justify-between mb-4 text-xs text-slate-500">
                <span>{doc.university}</span>
                <span>{doc.academic_year}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  <Eye className="w-3 h-3" />
                  <a className="underline hover:text-blue-600" href={doc.file_url} target="_blank" rel="noreferrer">Anteprima</a>
                </div>
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  <Download className="w-3 h-3" />
                  <span>{doc.is_free ? 'Download gratuito' : 'Acquisto richiesto'}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                {doc.is_free ? (
                  <button
                    onClick={() => handleFreeDownload(doc)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Gratis</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handlePurchase(doc)}
                    disabled={buying === doc.id}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{buying === doc.id ? 'Acquisto…' : `Acquista ${doc.price_eth} ETH`}</span>
                  </button>
                )}
                <a href={doc.file_url} target="_blank" rel="noreferrer" className="px-4 py-3 border border-slate-300 rounded-xl text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all">
                  <Eye className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {documents.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">Nessun documento disponibile</h3>
          <p className="text-slate-500">Sii il primo a caricare i tuoi appunti!</p>
        </div>
      )}
    </section>
  );
};

export default FeaturedNotes;