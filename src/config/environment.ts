// Environment configuration checker
export const checkEnvironment = () => {
  const requiredEnvVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };

  const optionalEnvVars = {
    VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
    VITE_NFT_CONTRACT_ADDRESS: import.meta.env.VITE_NFT_CONTRACT_ADDRESS,
  };

  const missing = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  return {
    isValid: missing.length === 0,
    missing,
    required: requiredEnvVars,
    optional: optionalEnvVars,
  };
};

export const environment = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  },
  nft: {
    contractAddress: import.meta.env.VITE_NFT_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  },
  app: {
    url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
    name: import.meta.env.VITE_APP_NAME || 'UniBrain',
  },
};

// Development mode helper
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
