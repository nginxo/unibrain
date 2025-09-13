import React, { ReactNode, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export function FrameProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize the Farcaster mini app SDK
    const initSDK = async () => {
      try {
        await sdk.actions.ready();
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error);
      }
    };
    
    initSDK();
  }, []);

  return <>{children}</>;
}
