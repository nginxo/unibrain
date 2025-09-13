import { FC, useEffect, useState } from 'react';
import { Wallet, User, Bell } from 'lucide-react';
import { connectWalletOnBase } from '../lib/wallet';
import logo from './logo.png';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const shorten = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const addr = await connectWalletOnBase();
      setAccount(addr);
    } catch (err) {
      console.error('Wallet connect error', err);
      alert('Connessione wallet fallita. Verifica MetaMask e la rete Base.');
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const ethereum = (window as any).ethereum as { on?: (ev: string, cb: any) => void; removeListener?: (ev: string, cb: any) => void } | undefined;
    if (!ethereum) return;
    const handler = (accounts: string[]) => setAccount(accounts?.[0] ?? null);
    ethereum.on?.('accountsChanged', handler);
    return () => ethereum?.removeListener?.('accountsChanged', handler);
  }, []);
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
            <button className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            {account ? (
              <div className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-full">
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">{shorten(account)}</span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all disabled:opacity-60"
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">{isConnecting ? 'Connessione…' : 'Connetti Wallet'}</span>
              </button>
            )}
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
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