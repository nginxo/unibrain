import { FC, useEffect, useState } from 'react';
import { Sparkles, TrendingUp, Clock, Zap } from 'lucide-react';
import { nftService } from '../services/nftService';
import { NFT } from '../types/database';
import { useAuth } from '../hooks/useAuth';

const NFTShowcase: FC = () => {
  const { isAuthenticated } = useAuth();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    setLoading(true);
    try {
      const data = await nftService.getAllNFTs(20);
      setNfts(data);
    } catch (error) {
      console.error('Error loading NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewNFT = (nft: NFT) => {
    // Open NFT metadata or external marketplace
    if (nft.metadata_uri) {
      window.open(nft.metadata_uri, '_blank');
    } else {
      alert(`NFT: ${nft.name}\nDescrizione: ${nft.description}\nProprietario: ${nft.owner_wallet}`);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Mythic': return 'from-purple-500 to-pink-500';
      case 'Legendary': return 'from-yellow-400 to-orange-500';
      case 'Epic': return 'from-blue-500 to-cyan-500';
      case 'Rare': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <section className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-6 py-3 rounded-full font-medium mb-6">
          <Sparkles className="w-5 h-5" />
          <span>NFT Collection Universitaria</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
          I tuoi appunti diventano{' '}
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            arte digitale
          </span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Ogni nota di eccezionale qualità viene automaticamente trasformata in un NFT unico, 
          creando valore permanente dal tuo lavoro accademico.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-800 mb-2">847</div>
          <div className="text-slate-600">NFT Creati</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-800 mb-2">245 ETH</div>
          <div className="text-slate-600">Volume Totale</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-800 mb-2">1,234</div>
          <div className="text-slate-600">Collezioni</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-800 mb-2">15.2k</div>
          <div className="text-slate-600">Holders</div>
        </div>
      </div>

      {/* NFT Collection */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
          <Sparkles className="w-6 h-6 text-purple-600 mr-3" />
          Collezione NFT Universitari
        </h2>
        
        {loading && <div className="text-slate-600">Caricamento NFT...</div>}
        
        {nfts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <div
                key={nft.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-200 group"
              >
                <div className="relative">
                  <img
                    src={nft.image_url || 'https://via.placeholder.com/400x300/6366f1/ffffff?text=Academic+NFT'}
                    alt={nft.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Academic NFT
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    #{nft.token_id}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    {nft.attributes && nft.attributes.find((attr: any) => attr.trait_type === 'Subject') && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {nft.attributes.find((attr: any) => attr.trait_type === 'Subject')?.value}
                      </span>
                    )}
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                  </div>

                  <h3 className="font-bold text-slate-800 mb-2 line-clamp-2">
                    {nft.name}
                  </h3>
                  
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {nft.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Proprietario</span>
                      <span className="font-medium text-sm text-slate-800">
                        {nft.owner_wallet.slice(0, 6)}...{nft.owner_wallet.slice(-4)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Creato</span>
                      <span className="text-slate-600">
                        {new Date(nft.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <button 
                      onClick={() => handleViewNFT(nft)} 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Visualizza NFT</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-purple-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">Nessun NFT ancora creato</h3>
              <p className="text-slate-500">Gli NFT vengono generati automaticamente quando gli utenti acquistano documenti di alta qualità!</p>
            </div>
          )
        )}
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
          Come Funziona il Sistema NFT
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">1</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Carica le Note</h3>
            <p className="text-slate-600">
              Carica i tuoi appunti di alta qualità sulla piattaforma
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">2</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Valutazione AI</h3>
            <p className="text-slate-600">
              L'AI valuta qualità e unicità per selezionare i contenuti migliori
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">3</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">NFT Automatico</h3>
            <p className="text-slate-600">
              Le note eccellenti diventano NFT unici pronti per la vendita
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NFTShowcase;