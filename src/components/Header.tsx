import { FC } from 'react';
import { Wallet, User, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import logo from './logo.png';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { user, isAuthenticated, isLoading, walletAddress, login, logout } = useAuth();

  const shorten = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

  const handleConnect = async () => {
    try {
      await login();
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Provide more specific error messages
      let errorMessage = 'Connessione wallet fallita.';
      
      if (err.message?.includes('MetaMask non trovato')) {
        errorMessage = 'MetaMask non installato. Installa MetaMask dal sito ufficiale metamask.io';
      } else if (err.message?.includes('rifiutata')) {
        errorMessage = 'Connessione rifiutata. Accetta la connessione in MetaMask.';
      } else if (err.message?.includes('già in corso')) {
        errorMessage = 'Richiesta già in corso. Controlla MetaMask e completa la richiesta.';
      } else if (err.message?.includes('rete Base')) {
        errorMessage = 'Impossibile configurare la rete Base. Aggiungi manualmente la rete Base in MetaMask.';
      }
      
      alert(errorMessage);
    }
  };
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <h1 className="text-xl font-bold text-slate-800">Unibrain</h1>
              <p className="text-xs text-slate-500">Università Marketplace</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('nft')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'nft'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              NFT Gallery
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'upload'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-slate-600 hover:text-purple-600'
              }`}
            >
              Carica Note
            </button>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <button className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-full">
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline">{walletAddress && shorten(walletAddress)}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-600 hover:text-red-600 transition-colors"
                  title="Disconnect"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all disabled:opacity-60"
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">{isLoading ? 'Connessione…' : 'Connetti Wallet'}</span>
              </button>
            )}
            
            {isAuthenticated && (
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center justify-center space-x-4 mt-4">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTab === 'marketplace'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-600'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('nft')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTab === 'nft'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-slate-600'
            }`}
          >
            NFT
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-purple-100 text-purple-700'
                : 'text-slate-600'
            }`}
          >
            Upload
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;