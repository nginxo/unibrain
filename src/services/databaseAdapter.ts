// Database Adapter - Switch automatico tra locale e Supabase
import { Document, User, Transaction, NFT, Download } from '../types/database';
import { localDatabase } from './localDatabase';
import { getSupabase } from '../lib/supabase';

class DatabaseAdapter {
  private useLocal = true;

  constructor() {
    // Check if Supabase is configured
    this.checkSupabaseConfig();
  }

  private checkSupabaseConfig() {
    try {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (url && key && url !== 'YOUR_SUPABASE_PROJECT_URL' && key !== 'YOUR_SUPABASE_ANON_KEY') {
        this.useLocal = false;
        console.log('✅ Usando Supabase database');
      } else {
        this.useLocal = true;
        console.log('📱 Usando database locale (nessuna configurazione richiesta)');
      }
    } catch {
      this.useLocal = true;
    }
  }

  // Users
  async getUser(walletAddress: string): Promise<User | null> {
    if (this.useLocal) {
      return localDatabase.getUser(walletAddress);
    }

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.warn('Supabase error, fallback to local:', error);
      return localDatabase.getUser(walletAddress);
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    if (this.useLocal) {
      return localDatabase.createUser(userData);
    }

    try {
      const supabase = getSupabase();
      const newUser = {
        wallet_address: userData.wallet_address!.toLowerCase(),
        username: userData.username || `user_${userData.wallet_address!.slice(-6)}`,
        email: userData.email,
        avatar_url: userData.avatar_url,
        bio: userData.bio,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Supabase error, fallback to local:', error);
      return localDatabase.createUser(userData);
    }
  }

  async updateUser(walletAddress: string, updates: Partial<User>): Promise<User | null> {
    if (this.useLocal) {
      return localDatabase.updateUser(walletAddress, updates);
    }

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('wallet_address', walletAddress.toLowerCase())
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Supabase error, fallback to local:', error);
      return localDatabase.updateUser(walletAddress, updates);
    }
  }

  // Documents
  async getDocuments(limit = 20, offset = 0): Promise<Document[]> {
    if (this.useLocal) {
      return localDatabase.getDocuments(limit, offset);
    }

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Supabase error, fallback to local:', error);
      return localDatabase.getDocuments(limit, offset);
    }
  }

  async createDocument(docData: Partial<Document>): Promise<Document> {
    if (this.useLocal) {
      return localDatabase.createDocument(docData);
    }

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('documents')
        .insert({
          ...docData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Supabase error, fallback to local:', error);
      return localDatabase.createDocument(docData);
    }
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | null> {
    if (this.useLocal) {
      return localDatabase.updateDocument(id, updates);
    }

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('documents')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Supabase error, fallback to local:', error);
      return localDatabase.updateDocument(id, updates);
    }
  }

  // Transactions
  async createTransaction(transactionData: Partial<Transaction>): Promise<Transaction> {
    if (this.useLocal) {
      return localDatabase.createTransaction(transactionData);
    }

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transactionData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Supabase error, fallback to local:', error);
      return localDatabase.createTransaction(transactionData);
    }
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | null> {
    if (this.useLocal) {
      return localDatabase.updateTransaction(id, updates);
    }

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('transactions')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Supabase error, fallback to local:', error);
      return localDatabase.updateTransaction(id, updates);
    }
  }

  // Downloads
  async createDownload(downloadData: Partial<Download>): Promise<Download> {
    if (this.useLocal) {
      return localDatabase.createDownload(downloadData);
    }

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('downloads')
        .insert({
          ...downloadData,
          downloaded_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Supabase error, fallback to local:', error);
      return localDatabase.createDownload(downloadData);
    }
  }

  // NFTs
  async createNFT(nftData: Partial<NFT>): Promise<NFT> {
    if (this.useLocal) {
      return localDatabase.createNFT(nftData);
    }

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('nfts')
        .insert({
          ...nftData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Supabase error, fallback to local:', error);
      return localDatabase.createNFT(nftData);
    }
  }

  async getNFTs(limit = 20): Promise<NFT[]> {
    if (this.useLocal) {
      return localDatabase.getNFTs(limit);
    }

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Supabase error, fallback to local:', error);
      return localDatabase.getNFTs(limit);
    }
  }

  async getUserNFTs(walletAddress: string): Promise<NFT[]> {
    if (this.useLocal) {
      return localDatabase.getUserNFTs(walletAddress);
    }

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .eq('owner_wallet', walletAddress.toLowerCase())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Supabase error, fallback to local:', error);
      return localDatabase.getUserNFTs(walletAddress);
    }
  }

  // Storage methods for local use
  async uploadFile(file: File, path: string): Promise<{ url: string; path: string }> {
    if (this.useLocal) {
      // For local development, create a blob URL
      const blob = new Blob([file], { type: file.type });
      const url = URL.createObjectURL(blob);
      return { url, path };
    }

    try {
      const supabase = getSupabase();
      const { error } = await supabase.storage
        .from('notes')
        .upload(path, file, { upsert: false });

      if (error) throw error;

      const { data } = supabase.storage
        .from('notes')
        .getPublicUrl(path);

      return { url: data.publicUrl, path };
    } catch (error) {
      console.warn('Supabase storage error, using local blob:', error);
      const blob = new Blob([file], { type: file.type });
      const url = URL.createObjectURL(blob);
      return { url, path };
    }
  }

  // Helper method to check current database mode
  getMode(): 'local' | 'supabase' {
    return this.useLocal ? 'local' : 'supabase';
  }

  // Force switch to local mode (for testing)
  forceLocalMode() {
    this.useLocal = true;
  }
}

export const database = new DatabaseAdapter();
