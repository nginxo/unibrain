import { FC } from 'react';
import { BookOpen, Twitter, Instagram, Github, Mail } from 'lucide-react';

const Footer: FC = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Unibrain</h3>
                <p className="text-slate-400 text-sm">Università Marketplace</p>
              </div>
            </div>
            <p className="text-slate-300 mb-6 max-w-md">
              La piattaforma che trasforma le tue note universitarie in valore reale, 
              connettendo studenti e creando opportunità di guadagno dall'eccellenza accademica.
            </p>
            <div className="flex space-x-4">
              <button className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors">
                <Github className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Marketplace</h4>
            <ul className="space-y-3 text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Note in Evidenza</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Categorie</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Università</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bestseller</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nuove Aggiunte</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Supporto</h4>
            <ul className="space-y-3 text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Centro Aiuto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Come Vendere</a></li>
              <li><a href="#" className="hover:text-white transition-colors">NFT Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contatti</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm mb-4 md:mb-0">
              © 2025 Unibrain. Tutti i diritti riservati.
            </p>
            <div className="flex space-x-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Termini di Servizio</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;