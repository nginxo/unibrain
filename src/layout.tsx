import { FrameProvider } from './providers/MiniKitProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <title>UniBrain - Farcaster Mini App</title>
        <meta name="description" content="A decentralized marketplace for AI-generated content" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-app-domain.com" />
        <meta property="og:title" content="UniBrain - AI Content Marketplace" />
        <meta property="og:description" content="Discover, create, and trade AI-generated content in our decentralized marketplace" />
        <meta property="og:image" content="https://your-app-domain.com/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://your-app-domain.com" />
        <meta property="twitter:title" content="UniBrain - AI Content Marketplace" />
        <meta property="twitter:description" content="Discover, create, and trade AI-generated content in our decentralized marketplace" />
        <meta property="twitter:image" content="https://your-app-domain.com/og-image.png" />

        {/* Farcaster Frame */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://your-app-domain.com/hero-image.png" />
        <meta property="fc:frame:button:1" content="Launch App" />
        <meta property="fc:frame:button:1:action" content="launch_frame" />
        <meta property="fc:frame:button:1:target" content="https://your-app-domain.com" />
        <meta property="fc:frame:button:1:post_url" content="https://your-app-domain.com/api/frame" />
      </head>
      <body>
        <FrameProvider>{children}</FrameProvider>
      </body>
    </html>
  );
}