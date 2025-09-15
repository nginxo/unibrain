-- UniBrain Database Schema for Supabase
-- Execute these commands in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    username TEXT,
    email TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    subject TEXT NOT NULL,
    university TEXT NOT NULL,
    course TEXT,
    professor TEXT,
    academic_year TEXT,
    tags TEXT[],
    price_eth DECIMAL(18, 8) NOT NULL DEFAULT 0,
    is_free BOOLEAN DEFAULT FALSE,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    upload_path TEXT NOT NULL,
    ai_summary JSONB,
    nft_token_id TEXT,
    nft_contract_address TEXT,
    downloads_count INTEGER DEFAULT 0,
    purchases_count INTEGER DEFAULT 0,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_hash TEXT UNIQUE NOT NULL,
    buyer_wallet TEXT NOT NULL,
    seller_wallet TEXT NOT NULL,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    amount_eth DECIMAL(18, 8) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
    nft_generated BOOLEAN DEFAULT FALSE,
    nft_token_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NFTs table
CREATE TABLE nfts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_id TEXT UNIQUE NOT NULL,
    contract_address TEXT NOT NULL,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    owner_wallet TEXT NOT NULL,
    metadata_uri TEXT,
    image_url TEXT,
    name TEXT NOT NULL,
    description TEXT,
    attributes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Downloads table
CREATE TABLE downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    user_wallet TEXT NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_subject ON documents(subject);
CREATE INDEX idx_documents_university ON documents(university);
CREATE INDEX idx_documents_created_at ON documents(created_at);
CREATE INDEX idx_transactions_buyer_wallet ON transactions(buyer_wallet);
CREATE INDEX idx_transactions_seller_wallet ON transactions(seller_wallet);
CREATE INDEX idx_transactions_document_id ON transactions(document_id);
CREATE INDEX idx_nfts_owner_wallet ON nfts(owner_wallet);
CREATE INDEX idx_nfts_document_id ON nfts(document_id);
CREATE INDEX idx_downloads_document_id ON downloads(document_id);
CREATE INDEX idx_downloads_user_wallet ON downloads(user_wallet);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfts ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Documents policies
CREATE POLICY "Anyone can view documents" ON documents FOR SELECT USING (true);
CREATE POLICY "Users can insert own documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON documents FOR DELETE USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions 
    FOR SELECT USING (auth.uid() IN (
        SELECT id FROM users WHERE wallet_address = buyer_wallet OR wallet_address = seller_wallet
    ));
CREATE POLICY "Anyone can insert transactions" ON transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update transactions" ON transactions FOR UPDATE WITH CHECK (true);

-- NFTs policies
CREATE POLICY "Anyone can view NFTs" ON nfts FOR SELECT USING (true);
CREATE POLICY "System can manage NFTs" ON nfts FOR ALL WITH CHECK (true);

-- Downloads policies
CREATE POLICY "Users can view own downloads" ON downloads 
    FOR SELECT USING (auth.uid() IN (
        SELECT id FROM users WHERE wallet_address = user_wallet
    ));
CREATE POLICY "Anyone can insert downloads" ON downloads FOR INSERT WITH CHECK (true);

-- Create storage bucket policies (run in SQL editor after creating 'notes' bucket)
INSERT INTO storage.buckets (id, name, public)
VALUES ('notes', 'notes', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for notes bucket
CREATE POLICY "Anyone can view notes" ON storage.objects 
    FOR SELECT USING (bucket_id = 'notes');

CREATE POLICY "Authenticated users can upload notes" ON storage.objects 
    FOR INSERT WITH CHECK (bucket_id = 'notes' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own notes" ON storage.objects 
    FOR UPDATE USING (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own notes" ON storage.objects 
    FOR DELETE USING (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create NFT metadata storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('nft-metadata', 'nft-metadata', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for nft-metadata bucket
CREATE POLICY "Anyone can view nft metadata" ON storage.objects 
    FOR SELECT USING (bucket_id = 'nft-metadata');

CREATE POLICY "System can manage nft metadata" ON storage.objects 
    FOR ALL USING (bucket_id = 'nft-metadata');

-- Functions and Triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON documents 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to get user stats
CREATE OR REPLACE FUNCTION get_user_stats(user_wallet_address TEXT)
RETURNS TABLE (
    documents_uploaded INTEGER,
    total_downloads INTEGER,
    total_purchases INTEGER,
    nfts_owned INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM documents d 
         JOIN users u ON d.user_id = u.id 
         WHERE u.wallet_address = user_wallet_address),
        (SELECT COUNT(*)::INTEGER FROM downloads 
         WHERE user_wallet = user_wallet_address),
        (SELECT COUNT(*)::INTEGER FROM transactions 
         WHERE buyer_wallet = user_wallet_address AND status = 'completed'),
        (SELECT COUNT(*)::INTEGER FROM nfts 
         WHERE owner_wallet = user_wallet_address);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get platform stats
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS TABLE (
    total_documents INTEGER,
    total_users INTEGER,
    total_nfts INTEGER,
    total_transactions INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM documents),
        (SELECT COUNT(*)::INTEGER FROM users),
        (SELECT COUNT(*)::INTEGER FROM nfts),
        (SELECT COUNT(*)::INTEGER FROM transactions WHERE status = 'completed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
