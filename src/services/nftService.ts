import { ethers } from 'ethers';
import { getSupabase } from '../lib/supabase';
import { NFT } from '../types/database';
import { NFTMetadata } from './aiService';
import { v4 as uuidv4 } from 'uuid';

// Simple ERC-721 ABI for minting
const NFT_CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "string", "name": "tokenURI", "type": "string" }
    ],
    "name": "mint",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "tokenURI",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  }
];

class NFTService {
  private contractAddress: string;
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;

  constructor() {
    // In production, this would be your deployed NFT contract address
    this.contractAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
  }

  async initializeContract(): Promise<void> {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(this.contractAddress, NFT_CONTRACT_ABI, signer);
    } else {
      throw new Error('MetaMask not found');
    }
  }

  async createNFT(
    ownerWallet: string,
    metadata: NFTMetadata,
    documentId: string
  ): Promise<NFT> {
    try {
      // Store metadata on IPFS or decentralized storage
      // For demo, we'll use a mock URI
      const metadataUri = await this.uploadMetadata(metadata);
      
      // For demo purposes, we'll create NFT record without actual blockchain interaction
      // In production, you would mint on actual blockchain
      const tokenId = this.generateTokenId();
      
      if (this.contractAddress !== '0x0000000000000000000000000000000000000000') {
        await this.initializeContract();
        // Actual minting would happen here
        // const tx = await this.contract!.mint(ownerWallet, metadataUri);
        // await tx.wait();
      }

      // Store NFT record in database
      const supabase = getSupabase();
      const nftData = {
        token_id: tokenId,
        contract_address: this.contractAddress,
        document_id: documentId,
        owner_wallet: ownerWallet.toLowerCase(),
        metadata_uri: metadataUri,
        image_url: metadata.image,
        name: metadata.name,
        description: metadata.description,
        attributes: metadata.attributes,
        created_at: new Date().toISOString()
      };

      const { data: nft, error } = await supabase
        .from('nfts')
        .insert(nftData)
        .select()
        .single();

      if (error) throw error;

      return nft;
    } catch (error) {
      console.error('NFT creation error:', error);
      throw error;
    }
  }

  async getUserNFTs(walletAddress: string): Promise<NFT[]> {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('nfts')
        .select(`
          *,
          documents:document_id (
            title,
            subject,
            university,
            created_at
          )
        `)
        .eq('owner_wallet', walletAddress.toLowerCase())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      return [];
    }
  }

  async getAllNFTs(limit = 20, offset = 0): Promise<NFT[]> {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('nfts')
        .select(`
          *,
          documents:document_id (
            title,
            subject,
            university,
            created_at
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      return [];
    }
  }

  async getNFTsBySubject(subject: string): Promise<NFT[]> {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('nfts')
        .select(`
          *,
          documents:document_id!inner (
            title,
            subject,
            university,
            created_at
          )
        `)
        .eq('documents.subject', subject)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching NFTs by subject:', error);
      return [];
    }
  }

  private async uploadMetadata(metadata: NFTMetadata): Promise<string> {
    // In production, upload to IPFS or Arweave
    // For demo, we'll store in Supabase storage or return a mock URI
    try {
      const supabase = getSupabase();
      const fileName = `metadata/${uuidv4()}.json`;
      
      const { data, error } = await supabase.storage
        .from('nft-metadata')
        .upload(fileName, JSON.stringify(metadata, null, 2), {
          contentType: 'application/json'
        });

      if (error) {
        // Fallback to mock URI
        return `https://gateway.pinata.cloud/ipfs/mock-hash-${Date.now()}`;
      }

      const { data: urlData } = supabase.storage
        .from('nft-metadata')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Metadata upload error:', error);
      return `https://gateway.pinata.cloud/ipfs/mock-hash-${Date.now()}`;
    }
  }

  private generateTokenId(): string {
    // Generate a unique token ID
    return Date.now().toString() + Math.random().toString(36).substring(7);
  }

  async transferNFT(tokenId: string, fromWallet: string, toWallet: string): Promise<boolean> {
    try {
      // In production, this would interact with the smart contract
      // For demo, we'll just update the database
      const supabase = getSupabase();
      const { error } = await supabase
        .from('nfts')
        .update({ 
          owner_wallet: toWallet.toLowerCase(),
          created_at: new Date().toISOString() // Using created_at as updated_at
        })
        .eq('token_id', tokenId)
        .eq('owner_wallet', fromWallet.toLowerCase());

      return !error;
    } catch (error) {
      console.error('NFT transfer error:', error);
      return false;
    }
  }
}

export const nftService = new NFTService();
