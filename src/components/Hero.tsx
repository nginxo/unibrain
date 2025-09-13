import { FC } from 'react';
import { TrendingUp, Users, Star, ArrowRight } from 'lucide-react';

const Hero: FC = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <TrendingUp className="w-4 h-4" />
          <span>+2,847 nuove note oggi</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
          Trasforma i tuoi{' '}
          <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
            appunti
          </span>{' '}
          in{' '}
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            NFT
          </span>
        </h1>
        
        <p className="text-xl text-slate-600 mb-12 leading-relaxed">
          Il primo marketplace universitario dove vendere le tue note di lezione 
          e creare automaticamente NFT unici dai tuoi appunti più preziosi.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
          <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2">
            <span>Esplora Marketplace</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="w-full sm:w-auto border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-full font-semibold hover:border-blue-400 hover:text-blue-600 transition-all">
            Carica le tue Note
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">50,000+ Studenti</h3>
            <p className="text-slate-600 text-sm">Comunità attiva di studenti da oltre 200 università</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">€2.3M+ Vendite</h3>
            <p className="text-slate-600 text-sm">Volume totale di transazioni sulla piattaforma</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">4.9/5 Rating</h3>
            <p className="text-slate-600 text-sm">Soddisfazione media degli acquirenti</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;