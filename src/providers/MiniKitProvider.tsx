import React, { ReactNode, useEffect, useState } from 'react';
import { sdk } from '@farcaster/frame-sdk';

export function FrameProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<any>(null);
  const [sharedCast, setSharedCast] = useState<any>(null);

  useEffect(() => {
    // Initialize the Farcaster frame SDK
    const initSDK = async () => {
      try {
        // Get the current context
        const currentContext = await sdk.context;
        setContext(currentContext);
        
        // Check if we have share extension capability
        if (currentContext?.capabilities?.includes('share_extension')) {
          // Listen for shared casts
          sdk.on('cast_shared', (cast) => {
            setSharedCast(cast);
            console.log('Received shared cast:', cast);
          });
        }
        
        // Signal that the frame is ready
        await sdk.actions.ready();
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error);
      }
    };
    
    initSDK();
  }, []);

  return (
    <div>
      {children}
      {sharedCast && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg">
          <p>Shared cast received: {sharedCast.text}</p>
        </div>
      )}
    </div>
  );
}
