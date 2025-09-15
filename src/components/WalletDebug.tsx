import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { isMetaMaskInstalled } from '../lib/wallet';

export const WalletDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  const checkWalletStatus = async () => {
    setIsLoading(true);
    try {
      const info: any = {
        metamaskInstalled: isMetaMaskInstalled(),
        ethereum: !!window.ethereum,
        isMetaMask: window.ethereum?.isMetaMask,
        accounts: [],
        chainId: null,
        connected: false,
      };

      if (window.ethereum) {
        try {
          info.accounts = await window.ethereum.request({ method: 'eth_accounts' });
          info.chainId = await window.ethereum.request({ method: 'eth_chainId' });
          info.connected = info.accounts.length > 0;
        } catch (error) {
          info.error = error.message;
        }
      }

      setDebugInfo(info);
    } catch (error) {
      console.error('Debug error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkWalletStatus();
  }, []);

  if (import.meta.env.PROD) {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Wallet Debug</h3>
        <button
          onClick={checkWalletStatus}
          disabled={isLoading}
          className="p-1 hover:bg-slate-700 rounded"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center space-x-2">
          {debugInfo.metamaskInstalled ? (
            <CheckCircle className="w-3 h-3 text-green-400" />
          ) : (
            <AlertTriangle className="w-3 h-3 text-red-400" />
          )}
          <span>MetaMask: {debugInfo.metamaskInstalled ? 'Installato' : 'Non trovato'}</span>
        </div>

        <div className="flex items-center space-x-2">
          {debugInfo.ethereum ? (
            <CheckCircle className="w-3 h-3 text-green-400" />
          ) : (
            <AlertTriangle className="w-3 h-3 text-red-400" />
          )}
          <span>Ethereum: {debugInfo.ethereum ? 'Disponibile' : 'Non disponibile'}</span>
        </div>

        <div className="flex items-center space-x-2">
          {debugInfo.connected ? (
            <CheckCircle className="w-3 h-3 text-green-400" />
          ) : (
            <AlertTriangle className="w-3 h-3 text-yellow-400" />
          )}
          <span>Connesso: {debugInfo.connected ? 'Sì' : 'No'}</span>
        </div>

        {debugInfo.accounts?.length > 0 && (
          <div className="text-xs text-slate-300">
            Account: {debugInfo.accounts[0]?.slice(0, 6)}...{debugInfo.accounts[0]?.slice(-4)}
          </div>
        )}

        {debugInfo.chainId && (
          <div className="text-xs text-slate-300">
            Chain: {debugInfo.chainId} {debugInfo.chainId === '0x2105' ? '(Base)' : '(Altra)'}
          </div>
        )}

        {debugInfo.error && (
          <div className="text-xs text-red-400 mt-2">
            Errore: {debugInfo.error}
          </div>
        )}
      </div>
    </div>
  );
};
