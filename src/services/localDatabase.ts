// Database locale integrato - Nessuna configurazione richiesta
import { Document, User, Transaction, NFT, Download } from '../types/database';
import { v4 as uuidv4 } from 'uuid';

class LocalDatabase {
  private storage = {
    users: 'unibrain_users',
    documents: 'unibrain_documents',
    transactions: 'unibrain_transactions',
    nfts: 'unibrain_nfts',
    downloads: 'unibrain_downloads'
  };

  // Initialize demo data
  constructor() {
    this.initializeDemoData();
  }

  private getItem<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setItem<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Storage error:', error);
    }
  }

  private initializeDemoData() {
    // Check if already initialized
    if (this.getItem(this.storage.documents).length > 0) return;

    // Demo documents
    const demoDocuments: Document[] = [
      {
        id: uuidv4(),
        title: "Analisi Matematica I - Limiti e Derivate",
        description: "Appunti completi su limiti, derivate e applicazioni. Include esempi pratici e esercizi risolti.",
        subject: "Matematica",
        university: "Università Bocconi",
        course: "Economia",
        professor: "Prof. Rossi",
        academic_year: "2024/2025",
        tags: ["matematica", "limiti", "derivate", "analisi"],
        price_eth: 0.01,
        is_free: false,
        file_url: "https://via.placeholder.com/400x300/2563eb/ffffff?text=Analisi+Matematica",
        file_name: "analisi_matematica_1.pdf",
        file_size: 2048000,
        file_type: "application/pdf",
        upload_path: "demo/analisi_matematica_1.pdf",
        downloads_count: 15,
        purchases_count: 8,
        user_id: "demo-user-1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: "Fisica Quantistica - Introduzione",
        description: "Note introduttive alla meccanica quantistica con esperimenti mentali e applicazioni moderne.",
        subject: "Fisica",
        university: "Politecnico di Milano",
        course: "Ingegneria Fisica",
        professor: "Prof. Bianchi",
        academic_year: "2024/2025",
        tags: ["fisica", "quantistica", "meccanica", "esperimenti"],
        price_eth: 0,
        is_free: true,
        file_url: "https://via.placeholder.com/400x300/059669/ffffff?text=Fisica+Quantistica",
        file_name: "fisica_quantistica_intro.pdf",
        file_size: 1536000,
        file_type: "application/pdf",
        upload_path: "demo/fisica_quantistica.pdf",
        downloads_count: 42,
        purchases_count: 0,
        user_id: "demo-user-2",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: "Programmazione Web - React e TypeScript",
        description: "Guida completa allo sviluppo web moderno con React, TypeScript e best practices.",
        subject: "Informatica",
        university: "Università Statale",
        course: "Informatica",
        professor: "Prof. Verdi",
        academic_year: "2024/2025",
        tags: ["react", "typescript", "web", "programmazione"],
        price_eth: 0.005,
        is_free: false,
        file_url: "https://via.placeholder.com/400x300/7c3aed/ffffff?text=React+TypeScript",
        file_name: "react_typescript_guide.pdf",
        file_size: 3072000,
        file_type: "application/pdf",
        upload_path: "demo/react_typescript.pdf",
        downloads_count: 28,
        purchases_count: 12,
        user_id: "demo-user-1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    this.setItem(this.storage.documents, demoDocuments);
  }

  // Users
  async getUser(walletAddress: string): Promise<User | null> {
    const users = this.getItem<User>(this.storage.users);
    return users.find(u => u.wallet_address.toLowerCase() === walletAddress.toLowerCase()) || null;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const users = this.getItem<User>(this.storage.users);
    const newUser: User = {
      id: uuidv4(),
      wallet_address: userData.wallet_address!.toLowerCase(),
      username: userData.username || `user_${userData.wallet_address!.slice(-6)}`,
      email: userData.email,
      avatar_url: userData.avatar_url,
      bio: userData.bio,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    users.push(newUser);
    this.setItem(this.storage.users, users);
    return newUser;
  }

  async updateUser(walletAddress: string, updates: Partial<User>): Promise<User | null> {
    const users = this.getItem<User>(this.storage.users);
    const index = users.findIndex(u => u.wallet_address.toLowerCase() === walletAddress.toLowerCase());
    
    if (index === -1) return null;
    
    users[index] = {
      ...users[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    this.setItem(this.storage.users, users);
    return users[index];
  }

  // Documents
  async getDocuments(limit = 20, offset = 0): Promise<Document[]> {
    const documents = this.getItem<Document>(this.storage.documents);
    return documents
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(offset, offset + limit);
  }

  async createDocument(docData: Partial<Document>): Promise<Document> {
    const documents = this.getItem<Document>(this.storage.documents);
    const newDoc: Document = {
      id: uuidv4(),
      title: docData.title!,
      description: docData.description!,
      subject: docData.subject!,
      university: docData.university!,
      course: docData.course,
      professor: docData.professor,
      academic_year: docData.academic_year,
      tags: docData.tags || [],
      price_eth: docData.price_eth || 0,
      is_free: docData.is_free || false,
      file_url: docData.file_url!,
      file_name: docData.file_name!,
      file_size: docData.file_size!,
      file_type: docData.file_type!,
      upload_path: docData.upload_path!,
      ai_summary: docData.ai_summary,
      downloads_count: 0,
      purchases_count: 0,
      user_id: docData.user_id!,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    documents.push(newDoc);
    this.setItem(this.storage.documents, documents);
    return newDoc;
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | null> {
    const documents = this.getItem<Document>(this.storage.documents);
    const index = documents.findIndex(d => d.id === id);
    
    if (index === -1) return null;
    
    documents[index] = {
      ...documents[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    this.setItem(this.storage.documents, documents);
    return documents[index];
  }

  // Transactions
  async createTransaction(transactionData: Partial<Transaction>): Promise<Transaction> {
    const transactions = this.getItem<Transaction>(this.storage.transactions);
    const newTransaction: Transaction = {
      id: uuidv4(),
      transaction_hash: transactionData.transaction_hash!,
      buyer_wallet: transactionData.buyer_wallet!.toLowerCase(),
      seller_wallet: transactionData.seller_wallet!.toLowerCase(),
      document_id: transactionData.document_id!,
      amount_eth: transactionData.amount_eth!,
      status: transactionData.status || 'pending',
      nft_generated: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    transactions.push(newTransaction);
    this.setItem(this.storage.transactions, transactions);
    return newTransaction;
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | null> {
    const transactions = this.getItem<Transaction>(this.storage.transactions);
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) return null;
    
    transactions[index] = {
      ...transactions[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    this.setItem(this.storage.transactions, transactions);
    return transactions[index];
  }

  // Downloads
  async createDownload(downloadData: Partial<Download>): Promise<Download> {
    const downloads = this.getItem<Download>(this.storage.downloads);
    const newDownload: Download = {
      id: uuidv4(),
      document_id: downloadData.document_id!,
      user_wallet: downloadData.user_wallet!.toLowerCase(),
      is_paid: downloadData.is_paid || false,
      transaction_id: downloadData.transaction_id,
      downloaded_at: new Date().toISOString()
    };
    
    downloads.push(newDownload);
    this.setItem(this.storage.downloads, downloads);
    return newDownload;
  }

  // NFTs
  async createNFT(nftData: Partial<NFT>): Promise<NFT> {
    const nfts = this.getItem<NFT>(this.storage.nfts);
    const newNFT: NFT = {
      id: uuidv4(),
      token_id: nftData.token_id!,
      contract_address: nftData.contract_address!,
      document_id: nftData.document_id!,
      owner_wallet: nftData.owner_wallet!.toLowerCase(),
      metadata_uri: nftData.metadata_uri,
      image_url: nftData.image_url,
      name: nftData.name!,
      description: nftData.description,
      attributes: nftData.attributes,
      created_at: new Date().toISOString()
    };
    
    nfts.push(newNFT);
    this.setItem(this.storage.nfts, nfts);
    return newNFT;
  }

  async getNFTs(limit = 20): Promise<NFT[]> {
    const nfts = this.getItem<NFT>(this.storage.nfts);
    return nfts
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  async getUserNFTs(walletAddress: string): Promise<NFT[]> {
    const nfts = this.getItem<NFT>(this.storage.nfts);
    return nfts.filter(nft => nft.owner_wallet.toLowerCase() === walletAddress.toLowerCase());
  }

  // Clear all data (for testing)
  clearAll(): void {
    Object.values(this.storage).forEach(key => {
      localStorage.removeItem(key);
    });
    this.initializeDemoData();
  }
}

export const localDatabase = new LocalDatabase();
