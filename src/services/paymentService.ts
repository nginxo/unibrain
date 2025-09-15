import { ethers } from 'ethers';
import { getSupabase } from '../lib/supabase';
import { Transaction, Document } from '../types/database';
import { aiService } from './aiService';
import { nftService } from './nftService';

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  transaction?: Transaction;
}

class PaymentService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  async initializeProvider(): Promise<void> {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
    } else {
      throw new Error('MetaMask not found');
    }
  }

  async purchaseDocument(
    document: Document,
    buyerWallet: string
  ): Promise<PaymentResult> {
    try {
      await this.initializeProvider();
      if (!this.signer) throw new Error('Signer not initialized');

      // Create pending transaction record
      const supabase = getSupabase();
      const transactionData = {
        buyer_wallet: buyerWallet.toLowerCase(),
        seller_wallet: document.user_id, // Assuming user_id contains wallet address
        document_id: document.id,
        amount_eth: document.price_eth,
        status: 'pending' as const,
        nft_generated: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Convert ETH to Wei
      const amountWei = ethers.parseEther(document.price_eth.toString());

      // Get seller address (in production, this might be from user profile)
      const sellerAddress = await this.getSellerAddress(document.user_id);

      // Send transaction
      const tx = await this.signer.sendTransaction({
        to: sellerAddress,
        value: amountWei,
        gasLimit: 21000
      });

      // Update transaction with hash
      await supabase
        .from('transactions')
        .update({ 
          transaction_hash: tx.hash,
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      // Wait for confirmation
      const receipt = await tx.wait();
      
      if (receipt?.status === 1) {
        // Transaction successful
        await supabase
          .from('transactions')
          .update({ 
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', transaction.id);

        // Update document stats
        await supabase
          .from('documents')
          .update({ 
            purchases_count: document.purchases_count + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', document.id);

        // Record download
        await this.recordDownload(document.id, buyerWallet, true, transaction.id);

        // Generate NFT asynchronously
        this.generateNFTAsync(document, transaction.id, buyerWallet);

        return {
          success: true,
          transactionHash: tx.hash,
          transaction
        };
      } else {
        // Transaction failed
        await supabase
          .from('transactions')
          .update({ 
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', transaction.id);

        return {
          success: false,
          error: 'Transaction failed'
        };
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      return {
        success: false,
        error: error.message || 'Payment failed'
      };
    }
  }

  async downloadForFree(documentId: string, userWallet: string): Promise<boolean> {
    try {
      await this.recordDownload(documentId, userWallet, false);
      
      // Update document stats
      const supabase = getSupabase();
      const { data: document } = await supabase
        .from('documents')
        .select('downloads_count')
        .eq('id', documentId)
        .single();

      if (document) {
        await supabase
          .from('documents')
          .update({ 
            downloads_count: document.downloads_count + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', documentId);
      }

      return true;
    } catch (error) {
      console.error('Free download error:', error);
      return false;
    }
  }

  private async recordDownload(
    documentId: string,
    userWallet: string,
    isPaid: boolean,
    transactionId?: string
  ): Promise<void> {
    const supabase = getSupabase();
    await supabase
      .from('downloads')
      .insert({
        document_id: documentId,
        user_wallet: userWallet.toLowerCase(),
        is_paid: isPaid,
        transaction_id: transactionId,
        downloaded_at: new Date().toISOString()
      });
  }

  private async getSellerAddress(userId: string): Promise<string> {
    const supabase = getSupabase();
    const { data: user } = await supabase
      .from('users')
      .select('wallet_address')
      .eq('id', userId)
      .single();

    if (!user?.wallet_address) {
      throw new Error('Seller wallet address not found');
    }

    return user.wallet_address;
  }

  private async generateNFTAsync(
    document: Document,
    transactionId: string,
    buyerWallet: string
  ): Promise<void> {
    try {
      // Get AI summary if not exists
      let summary = document.ai_summary;
      if (!summary) {
        const documentSummary = await aiService.summarizeDocument(
          'Document content', // In production, extract actual content
          document.title,
          document.subject
        );
        summary = JSON.stringify(documentSummary);
        
        // Update document with summary
        const supabase = getSupabase();
        await supabase
          .from('documents')
          .update({ 
            ai_summary: summary,
            updated_at: new Date().toISOString()
          })
          .eq('id', document.id);
      }

      // Generate NFT metadata
      const summaryData = JSON.parse(summary);
      const metadata = await aiService.generateNFTMetadata({
        title: document.title,
        subject: document.subject,
        summary: summaryData,
        university: document.university,
        professor: document.professor || undefined
      });

      // Create NFT (this would integrate with actual NFT contract)
      const nft = await nftService.createNFT(buyerWallet, metadata, document.id);

      // Update transaction with NFT info
      const supabase = getSupabase();
      await supabase
        .from('transactions')
        .update({
          nft_generated: true,
          nft_token_id: nft.token_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);

      console.log('NFT generated successfully:', nft);
    } catch (error) {
      console.error('NFT generation error:', error);
    }
  }
}

export const paymentService = new PaymentService();
