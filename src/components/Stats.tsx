import { FC } from 'react';
import { TrendingUp, DollarSign, Users, Award } from 'lucide-react';

const Stats: FC = () => {
  return (
    <section className="container mx-auto px-4 py-8 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-slate-200 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-1">47.2k</div>
          <div className="text-sm text-slate-600">Studenti Attivi</div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-slate-200 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-1">€2.8M</div>
          <div className="text-sm text-slate-600">Vendite Totali</div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-slate-200 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-1">1,234</div>
          <div className="text-sm text-slate-600">NFT Creati</div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-slate-200 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-1">+285%</div>
          <div className="text-sm text-slate-600">Crescita Mensile</div>
        </div>
      </div>
    </section>
  );
};

export default Stats;