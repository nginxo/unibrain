# 🚀 Quick Start - UniBrain

## ✅ Risoluzione Problema Wallet

I warning nel build sono **NORMALI** e non impediscono il funzionamento! L'app funziona correttamente.

## 📋 Setup Rapido

### 1. Prerequisiti
```bash
✅ Node.js installato
✅ MetaMask installato nel browser
✅ Account Supabase creato
```

### 2. Configurazione Environment
Crea file `.env` nella root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=sk-your-key (opzionale)
```

### 3. Setup Database
```bash
1. Vai su https://supabase.com
2. Crea nuovo progetto
3. Vai in SQL Editor
4. Esegui tutto il contenuto di `database-schema.sql`
5. Vai in Storage → Create bucket "notes" (public)
6. Vai in Storage → Create bucket "nft-metadata" (public)
```

### 4. Avvio Applicazione
```bash
npm install
npm run dev
```

## 🔧 Test Connessione Wallet

### Browser Desktop
1. Apri `http://localhost:5173`
2. Verifica che appaia il **pannello debug** in basso a destra
3. Controlla che MetaMask sia "Installato" ✅
4. Clicca "Connetti Wallet" nell'header
5. Approva la connessione in MetaMask

### Risoluzione Problemi

**MetaMask non rilevato:**
- Installa da https://metamask.io/download/
- Riavvia il browser
- Verifica che l'estensione sia attiva

**Connessione fallisce:**
- Controlla che non ci siano popup bloccati
- Clicca manualmente su MetaMask
- Prova in modalità incognito

**Rete sbagliata:**
- L'app aggiunge automaticamente Base network
- O aggiungi manualmente: Chain ID 8453

## 📱 Features Funzionanti

### ✅ Completamente Implementato
- 🔗 Connessione MetaMask
- 👤 Registrazione automatica utenti
- 📄 Upload documenti con metadata
- 💰 Sistema free/paid
- 💳 Pagamenti ETH reali
- 🤖 Analisi AI documenti
- 🎨 Generazione NFT automatica
- 📊 Tracking transazioni

### 🎯 Come Testare

**1. Connessione Wallet:**
- Status nella Hero section
- Debug panel in basso a destra

**2. Upload Documento:**
- Vai su "Upload" tab
- Carica PDF/DOC
- Compila metadata
- Scegli free/paid
- Pubblica

**3. Marketplace:**
- Vedi documenti caricati
- Prova download gratuiti
- Testa acquisti con ETH

**4. NFT Gallery:**
- Visualizza NFT generati
- Metadata automatici

## 🆘 Support

**L'app è production-ready!**

I warning nel build sono solo deprecation notices delle vecchie librerie WalletConnect ma **non influenzano il funzionamento**.

**Tutto funziona correttamente:**
- ✅ Build completato
- ✅ Wallet connection implementata
- ✅ Database schema completo  
- ✅ Pagamenti ETH funzionanti
- ✅ AI integration ready
- ✅ NFT system completo

**Per deployment:**
1. Configura environment variables su Vercel
2. Setup Supabase production
3. Deploy! 🚀
