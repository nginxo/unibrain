export const BASE_MAINNET = {
  id: 8453,
  chainId: '0x2105', // 8453
  chainName: 'Base Mainnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://base.blockscout.com/']
};

// Declare ethereum interface properly
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] | object }) => Promise<any>;
      on?: (event: string, callback: (data: any) => void) => void;
      removeListener?: (event: string, callback: (data: any) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

const getEthereum = () => window.ethereum;

export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask);
};

export const ensureBaseNetwork = async () => {
  const ethereum = getEthereum();
  if (!ethereum?.request) {
    throw new Error('MetaMask non rilevato. Installa MetaMask per continuare.');
  }
  
  try {
    await ethereum.request({ 
      method: 'wallet_switchEthereumChain', 
      params: [{ chainId: BASE_MAINNET.chainId }] 
    });
  } catch (switchErr: any) {
    // 4902 = chain not added
    if (switchErr?.code === 4902) {
      try {
        await ethereum.request({ 
          method: 'wallet_addEthereumChain', 
          params: [BASE_MAINNET] 
        });
      } catch (addErr) {
        throw new Error('Impossibile aggiungere la rete Base. Aggiungila manualmente.');
      }
    } else {
      throw switchErr;
    }
  }
};

export const connectWalletOnBase = async (): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask non trovato. Installa MetaMask dal sito ufficiale.');
  }

  const ethereum = getEthereum();
  if (!ethereum?.request) {
    throw new Error('MetaMask non disponibile.');
  }

  try {
    // First request accounts
    const accounts: string[] = await ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    if (!accounts?.length) {
      throw new Error('Nessun account selezionato in MetaMask.');
    }

    // Then ensure we're on the right network
    await ensureBaseNetwork();
    
    return accounts[0];
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Connessione rifiutata dall\'utente.');
    } else if (error.code === -32002) {
      throw new Error('Richiesta già in corso. Controlla MetaMask.');
    }
    throw error;
  }
};

const MERCHANT_KEY = 'STUDYNFT_MERCHANT_ADDRESS';
export const getMerchantAddress = (): string => {
  try { return localStorage.getItem(MERCHANT_KEY) || ''; } catch { return ''; }
};
export const setMerchantAddress = (addr: string) => {
  try { localStorage.setItem(MERCHANT_KEY, addr); } catch {}
};
export const ensureMerchantAddress = (): string => {
  let addr = getMerchantAddress();
  if (!addr) {
    addr = window.prompt('Inserisci indirizzo ETH del merchant (Base mainnet)') || '';
    if (addr) setMerchantAddress(addr);
  }
  if (!addr) throw new Error('Indirizzo merchant non configurato');
  return addr;
};


