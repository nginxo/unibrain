import { FC } from 'react';
import { Sparkles, TrendingUp, Clock, Zap } from 'lucide-react';
import { ensureBaseNetwork } from '../lib/wallet';

const NFTShowcase: FC = () => {
  const nfts = [
    {
      id: 1,
      title: "Teorema di Fermat - Ultima Dimostrazione",
      subject: "Matematica Avanzata",
      creator: "Prof. Alessandro M.",
      currentBid: "2.5 ETH",
      timeLeft: "2h 15m",
      image: "https://images.pexels.com/photos/6256065/pexels-photo-6256065.jpeg?auto=compress&cs=tinysrgb&w=400",
      rarity: "Legendary",
      bidders: 23
    },
    {
      id: 2,
      title: "DNA Structure Analysis Notes",
      subject: "Biologia Molecolare",
      creator: "Dr. Maria R.",
      currentBid: "1.8 ETH",
      timeLeft: "1d 8h",
      image: "https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400",
      rarity: "Epic",
      bidders: 15
    },
    {
      id: 3,
      title: "Quantum Physics Breakthrough",
      subject: "Fisica Quantistica",
      creator: "Luca S.",
      currentBid: "3.2 ETH",
      timeLeft: "5h 42m",
      image: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400",
      rarity: "Mythic",
      bidders: 31
    },
    {
      id: 4,
      title: "Renaissance Art Analysis",
      subject: "Storia dell'Arte",
      creator: "Elena C.",
      currentBid: "0.9 ETH",
      timeLeft: "3d 12h",
      image: "https://images.pexels.com/photos/159581/dictionary-reference-book-learning-meaning-159581.jpeg?auto=compress&cs=tinysrgb&w=400",
      rarity: "Rare",
      bidders: 8
    }
  ];

  const handleBid = async (title: string) => {
    try {
      const ethereum = (window as any).ethereum as { request?: (args: any) => Promise<any> } | undefined;
      if (!ethereum) {
        alert('MetaMask non rilevato.');
        return;
      }
      const amount = window.prompt("Inserisci l'offerta (ETH)", "0.1");
      if (!amount) return;
      await ensureBaseNetwork();
      const [account] = await ethereum.request?.({ method: 'eth_requestAccounts' });
      const msg = `Offerta di ${amount} ETH per "${title}" - ${new Date().toISOString()}`;
      const signature = await ethereum.request?.({ method: 'personal_sign', params: [msg, account] });
      alert('Offerta registrata!\n\nFirma:\n' + signature);
    } catch (e) {
      console.error(e);
      alert('Offerta annullata o fallita.');
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

      {/* Featured Auctions */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
          <Clock className="w-6 h-6 text-blue-600 mr-3" />
          Aste in Corso
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-200 group"
            >
              <div className="relative">
                <img
                  src={nft.image}
                  alt={nft.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className={`bg-gradient-to-r ${getRarityColor(nft.rarity)} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                    {nft.rarity}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{nft.timeLeft}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {nft.subject}
                  </span>
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>

                <h3 className="font-bold text-slate-800 mb-2 line-clamp-2">
                  {nft.title}
                </h3>
                
                <p className="text-sm text-slate-600 mb-4">di {nft.creator}</p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Offerta Attuale</span>
                    <span className="font-bold text-lg text-slate-800">{nft.currentBid}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">{nft.bidders} offerenti</span>
                    <div className="flex items-center space-x-1 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>+12%</span>
                    </div>
                  </div>

                  <button onClick={() => handleBid(nft.title)} className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Fai un'Offerta</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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