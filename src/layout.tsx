import { FrameProvider } from './providers/MiniKitProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <title>UniBrain - Farcaster Mini App</title>
        <meta name="description" content="A decentralized marketplace for AI-generated content" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://unibrain.vercel.app" />
        <meta property="og:title" content="UniBrain - AI Content Marketplace" />
        <meta property="og:description" content="Discover, create, and trade AI-generated content in our decentralized marketplace" />
        <meta property="og:image" content="https://unibrain.vercel.app/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://unibrain.vercel.app" />
        <meta property="twitter:title" content="UniBrain - AI Content Marketplace" />
        <meta property="twitter:description" content="Discover, create, and trade AI-generated content in our decentralized marketplace" />
        <meta property="twitter:image" content="https://unibrain.vercel.app/og-image.png" />

        {/* Farcaster Frame */}
        <meta name="fc:frame" content='{"version":"next","imageUrl":"https://unibrain.vercel.app/hero-image.png","button":{"title":"Open","action":{"type":"launch_frame","name":"UniBrain","url":"https://unibrain.vercel.app"}}}' />
      </head>
      <body>
        <FrameProvider>{children}</FrameProvider>
      </body>
    </html>
  );
}