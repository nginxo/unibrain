# UniBrain - Complete Setup Guide

## 🎉 App Features Implemented

✅ **User Authentication** - MetaMask wallet connection with user profiles
✅ **Document Upload** - Upload and publish documents with metadata
✅ **Payment System** - MetaMask integration for ETH payments
✅ **Free vs Paid Access** - Dual system for free downloads and paid purchases
✅ **AI Integration** - Document summarization and quality assessment
✅ **NFT Generation** - Automatic NFT creation for purchased documents
✅ **Real-time Database** - Supabase integration with comprehensive schema

## 🛠️ Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory:

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration (optional - for AI features)
VITE_OPENAI_API_KEY=your_openai_api_key

# NFT Contract Configuration (optional)
VITE_NFT_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Farcaster Frame Configuration
VITE_APP_URL=https://your-app-domain.com
VITE_APP_NAME=UniBrain
VITE_HERO_IMAGE=https://your-app-domain.com/hero-image.png
VITE_SPLASH_IMAGE=https://your-app-domain.com/splash-image.png
VITE_SPLASH_BG_COLOR=#ffffff
```

### 2. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Copy your project URL and anon key to the `.env` file
3. Execute the SQL commands from `database-schema.sql` in your Supabase SQL Editor
4. Create storage buckets:
   - Create `notes` bucket (public)
   - Create `nft-metadata` bucket (public)

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

## 🚀 Key Features

### Authentication System
- **Wallet Connection**: Users connect via MetaMask
- **User Profiles**: Automatic profile creation with wallet address
- **Session Management**: Persistent authentication state

### Document Marketplace
- **Upload System**: Drag & drop file upload with metadata
- **Pricing Options**: Free downloads or ETH pricing
- **AI Summarization**: Automatic document analysis and summarization
- **Search & Filter**: Browse by subject, university, etc.

### Payment System
- **MetaMask Integration**: Real ETH transactions on Base network
- **Transaction Tracking**: Complete payment history
- **Download Tracking**: Track free and paid downloads

### NFT System
- **Automatic Generation**: NFTs created for purchased documents
- **Metadata Storage**: Comprehensive NFT attributes
- **Collection View**: Browse all generated NFTs
- **Owner Tracking**: Track NFT ownership and transfers

### AI Features
- **Document Analysis**: Extract key information and topics
- **Quality Assessment**: Evaluate content for NFT generation
- **Smart Summarization**: Generate concise summaries
- **Metadata Generation**: Create rich NFT metadata

## 📱 User Journey

1. **Connect Wallet**: User connects MetaMask wallet
2. **Browse Documents**: Explore available academic documents
3. **Purchase or Download**: Choose free download or pay with ETH
4. **Receive NFT**: High-quality purchases automatically generate NFTs
5. **View Collection**: Users can view their NFT collection

## 🔧 Technical Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Authentication**: Wallet-based with MetaMask
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage for files and metadata
- **Blockchain**: Base network for ETH transactions
- **AI**: OpenAI integration for document analysis

## 🛡️ Security Features

- **Row Level Security**: Database access control
- **Wallet Verification**: Cryptographic authentication
- **File Upload Validation**: Secure file handling
- **Transaction Verification**: Blockchain transaction verification

## 🎯 Next Steps for Production

1. **Deploy Smart Contract**: Deploy actual NFT contract for production
2. **Configure IPFS**: Use IPFS for decentralized metadata storage
3. **Add More AI Features**: Enhanced document analysis
4. **Implement Bidding**: Add NFT marketplace functionality
5. **Add Notifications**: Real-time updates for users
6. **Enhanced Analytics**: User and platform analytics dashboard

## 📞 Support

The application is now fully functional with all requested features:
- ✅ User registration with wallet connection
- ✅ Document upload and marketplace
- ✅ Free and paid access system
- ✅ Real MetaMask payments
- ✅ AI document analysis
- ✅ Automatic NFT generation
- ✅ Complete database integration

Ready for deployment and further customization!
