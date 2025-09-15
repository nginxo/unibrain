# 🔧 Guida Debug Connessione Wallet

## Problemi Comuni e Soluzioni

### 1. "MetaMask non rilevato"

**Cause possibili:**
- MetaMask non installato
- MetaMask disabilitato
- Blocco popup del browser
- Estensione non attiva

**Soluzioni:**
```bash
# 1. Verifica installazione MetaMask
- Vai su https://metamask.io/download/
- Installa l'estensione per il tuo browser
- Crea/importa un wallet

# 2. Verifica che MetaMask sia attivo
- Clicca sull'icona MetaMask nel browser
- Sblocca il wallet con la password
- Verifica che ci sia almeno un account
```

### 2. "Connessione rifiutata dall'utente"

**Cause:**
- Utente ha cliccato "Rifiuta" in MetaMask
- Popup di MetaMask non apparso

**Soluzioni:**
```bash
# 1. Riprova la connessione
- Clicca nuovamente "Connetti Wallet"
- Assicurati che il popup MetaMask appaia
- Clicca "Connetti" nel popup

# 2. Se il popup non appare
- Controlla se MetaMask è bloccato dal browser
- Clicca sull'icona MetaMask manualmente
- Vai in Settings > Connected Sites
```

### 3. "Rete Base non configurata"

**Soluzioni:**
```bash
# Aggiungi manualmente la rete Base:
Network Name: Base Mainnet
RPC URL: https://mainnet.base.org
Chain ID: 8453
Currency Symbol: ETH
Block Explorer: https://base.blockscout.com/
```

### 4. Build Warnings (Non critici)

I warning che vedi nel build sono normali:
```
npm warn deprecated @walletconnect/types@1.8.0
npm warn deprecated @json-rpc-tools/provider@1.7.6
```

**Questi sono solo warning di deprecazione e NON impediscono il funzionamento dell'app.**

### 5. Debug della Connessione

Per testare la connessione, apri la console del browser (F12) e verifica:

```javascript
// Controlla se MetaMask è disponibile
console.log('MetaMask installed:', !!window.ethereum?.isMetaMask);

// Controlla account connessi
window.ethereum?.request({method: 'eth_accounts'}).then(console.log);

// Controlla rete attuale
window.ethereum?.request({method: 'eth_chainId'}).then(console.log);
```

### 6. Test Locale

```bash
# 1. Installa dipendenze
npm install

# 2. Avvia in sviluppo
npm run dev

# 3. Apri http://localhost:5173

# 4. Verifica console browser per errori
```

### 7. Variabili Ambiente Richieste

Crea file `.env` nella root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 8. Verifica Funzionamento Supabase

```bash
# Controlla nella console del browser:
# 1. Vai alla tab Network
# 2. Prova a connettere il wallet
# 3. Verifica richieste a Supabase senza errori 4xx/5xx
```

## ✅ Checklist Debug

- [ ] MetaMask installato e sbloccato
- [ ] Account disponibile in MetaMask  
- [ ] Popup consentiti per il sito
- [ ] Variabili ambiente configurate
- [ ] Supabase progetto attivo
- [ ] Console browser senza errori critici
- [ ] Rete Base aggiunta (o si aggiunge automaticamente)

## 🆘 Se Persiste il Problema

1. **Prova in incognito** - elimina cache/estensioni
2. **Prova browser diverso** - Firefox, Chrome, Edge
3. **Resetta MetaMask** - Settings > Advanced > Reset Account
4. **Verifica console** - copia errori specifici
5. **Test con wallet diverso** - Trust Wallet, Coinbase Wallet

## 📱 Test Mobile

Su mobile, usa browser con supporto Web3:
- MetaMask Mobile Browser
- Trust Wallet Browser  
- Coinbase Wallet Browser

**L'app è progettata per funzionare su desktop e mobile!**
