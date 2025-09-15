export interface User {
  id: string;
  wallet_address: string;
  username?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  subject: string;
  university: string;
  course?: string;
  professor?: string;
  academic_year?: string;
  tags: string[];
  price_eth: number;
  is_free: boolean;
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: string;
  upload_path: string;
  ai_summary?: string;
  nft_token_id?: string;
  nft_contract_address?: string;
  downloads_count: number;
  purchases_count: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  transaction_hash: string;
  buyer_wallet: string;
  seller_wallet: string;
  document_id: string;
  amount_eth: number;
  status: 'pending' | 'completed' | 'failed';
  nft_generated: boolean;
  nft_token_id?: string;
  created_at: string;
  updated_at: string;
}

export interface NFT {
  id: string;
  token_id: string;
  contract_address: string;
  document_id: string;
  owner_wallet: string;
  metadata_uri: string;
  image_url: string;
  name: string;
  description: string;
  attributes: Record<string, any>;
  created_at: string;
}

export interface Download {
  id: string;
  document_id: string;
  user_wallet: string;
  is_paid: boolean;
  transaction_id?: string;
  downloaded_at: string;
}
