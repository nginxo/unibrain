import { useState, useEffect, createContext, useContext } from 'react';
import { connectWalletOnBase } from '../lib/wallet';
import { User } from '../types/database';
import { database } from '../services/databaseAdapter';

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
      const userData = await database.getUser(wallet);
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createUserProfile = async (wallet: string): Promise<User> => {
    const userData = {
      wallet_address: wallet.toLowerCase(),
      username: `user_${wallet.slice(-6)}`
    };

    return await database.createUser(userData);
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
        userData = await database.getUser(wallet);
        if (!userData) {
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
      const updatedUser = await database.updateUser(walletAddress, updates);
      if (updatedUser) {
        setUser(updatedUser);
      }
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
