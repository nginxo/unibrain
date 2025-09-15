import React from 'react';
import { AlertCircle, CheckCircle, ExternalLink, Wallet } from 'lucide-react';
import { isMetaMaskInstalled } from '../lib/wallet';

interface WalletStatusProps {
  isConnected: boolean;
  isLoading: boolean;
  address?: string | null;
}

export const WalletStatus: React.FC<WalletStatusProps> = ({ 
  isConnected, 
  isLoading, 
  address 
}) => {
  const metamaskInstalled = isMetaMaskInstalled();

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center space-x-3">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        <span className="text-blue-800">Verifica connessione wallet...</span>
      </div>
    );
  }

  if (!metamaskInstalled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800 mb-2">MetaMask non installato</h3>
            <p className="text-red-700 text-sm mb-3">
              Per utilizzare questa applicazione, devi installare MetaMask.
            </p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <span>Installa MetaMask</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Wallet className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Wallet non connesso</h3>
            <p className="text-yellow-700 text-sm">
              Clicca su "Connetti Wallet" nell'header per connettere il tuo MetaMask.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
      <div className="flex items-start space-x-3">
        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
        <div>
          <h3 className="font-semibold text-green-800 mb-1">Wallet connesso</h3>
          <p className="text-green-700 text-sm">
            Indirizzo: <code className="bg-green-100 px-2 py-1 rounded text-xs">{address}</code>
          </p>
        </div>
      </div>
    </div>
  );
};
