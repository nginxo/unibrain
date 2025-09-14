import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/frame-sdk';

export interface FarcasterContext {
  capabilities: string[];
  user: {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl: string;
  } | null;
  cast: {
    hash: string;
    text: string;
    author: {
      fid: number;
      username: string;
      displayName: string;
      pfpUrl: string;
    };
  } | null;
}

export function useFarcasterContext() {
  const [context, setContext] = useState<FarcasterContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initContext = async () => {
      try {
        setLoading(true);
        const currentContext = await sdk.context;
        setContext(currentContext);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get context');
        console.error('Failed to get Farcaster context:', err);
      } finally {
        setLoading(false);
      }
    };

    initContext();
  }, []);

  const hasCapability = (capability: string) => {
    return context?.capabilities?.includes(capability) || false;
  };

  const shareCast = async (text: string) => {
    try {
      if (hasCapability('share_extension')) {
        await sdk.actions.share({
          text,
          embeds: []
        });
      } else {
        console.warn('Share extension capability not available');
      }
    } catch (err) {
      console.error('Failed to share cast:', err);
    }
  };

  return {
    context,
    loading,
    error,
    hasCapability,
    shareCast
  };
}
