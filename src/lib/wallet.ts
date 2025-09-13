export const BASE_MAINNET = {
  chainId: '0x2105', // 8453
  chainName: 'Base Mainnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://base.blockscout.com/']
};

const getEthereum = () => (window as any).ethereum as {
  request?: (args: { method: string; params?: any[] | object }) => Promise<any>;
} | undefined;

export const ensureBaseNetwork = async () => {
  const ethereum = getEthereum();
  if (!ethereum?.request) throw new Error('MetaMask non rilevato.');
  try {
    await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: BASE_MAINNET.chainId }] });
  } catch (switchErr: any) {
    // 4902 = chain not added
    if (switchErr?.code === 4902) {
      await ethereum.request({ method: 'wallet_addEthereumChain', params: [BASE_MAINNET] });
    } else {
      throw switchErr;
    }
  }
};

export const connectWalletOnBase = async (): Promise<string> => {
  const ethereum = getEthereum();
  if (!ethereum?.request) throw new Error('MetaMask non rilevato.');
  await ensureBaseNetwork();
  const accounts: string[] = await ethereum.request({ method: 'eth_requestAccounts' });
  if (!accounts?.length) throw new Error('Nessun account selezionato');
  return accounts[0];
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


