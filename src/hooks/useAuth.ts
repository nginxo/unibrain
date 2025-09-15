import { useState, useEffect, createContext, useContext } from 'react';
import { getSupabase } from '../lib/supabase';
import { connectWalletOnBase } from '../lib/wallet';
import { User } from '../types/database';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  walletAddress: string | null;
  login: () => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const isAuthenticated = !!user && !!walletAddress;

  useEffect(() => {
    // Check if user was previously connected
    const savedWallet = localStorage.getItem('connected_wallet');
    if (savedWallet) {
      setWalletAddress(savedWallet);
      loadUserProfile(savedWallet);
    } else {
      setIsLoading(false);
    }

    // Listen for account changes in MetaMask
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected wallet
          logout();
        } else if (accounts[0] !== walletAddress) {
          // User switched accounts
          setWalletAddress(accounts[0]);
          localStorage.setItem('connected_wallet', accounts[0]);
          loadUserProfile(accounts[0]);
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      window.ethereum.on?.('accountsChanged', handleAccountsChanged);
      window.ethereum.on?.('chainChanged', handleChainChanged);

      // Cleanup listeners
      return () => {
        window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener?.('chainChanged', handleChainChanged);
      };
    }
  }, [walletAddress]);

  const loadUserProfile = async (wallet: string) => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', wallet.toLowerCase())
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setUser(data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createUserProfile = async (wallet: string): Promise<User> => {
    const supabase = getSupabase();
    const userData = {
      wallet_address: wallet.toLowerCase(),
      username: `user_${wallet.slice(-6)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const login = async () => {
    try {
      setIsLoading(true);
      const wallet = await connectWalletOnBase();
      setWalletAddress(wallet);
      localStorage.setItem('connected_wallet', wallet);

      // Try to load existing user or create new one
      let userData = user;
      if (!userData) {
        const supabase = getSupabase();
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('wallet_address', wallet.toLowerCase())
          .single();

        if (data) {
          userData = data;
        } else {
          userData = await createUserProfile(wallet);
        }
      }

      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setWalletAddress(null);
    localStorage.removeItem('connected_wallet');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user || !walletAddress) return;

    try {
      const supabase = getSupabase();
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('users')
        .update(updatedData)
        .eq('wallet_address', walletAddress.toLowerCase())
        .select()
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    walletAddress,
    login,
    logout,
    updateProfile
  };
};

export { AuthContext };
