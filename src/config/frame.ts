// Farcaster Mini App Configuration
export const frameConfig = {
  appUrl: import.meta.env.VITE_APP_URL || 'https://your-app-domain.com',
  appName: import.meta.env.VITE_APP_NAME || 'UniBrain',
  heroImage: import.meta.env.VITE_HERO_IMAGE || 'https://your-app-domain.com/hero-image.png',
  splashImage: import.meta.env.VITE_SPLASH_IMAGE || 'https://your-app-domain.com/splash-image.png',
  splashBgColor: import.meta.env.VITE_SPLASH_BG_COLOR || '#ffffff',
};

// Frame metadata for Farcaster
export const frameMetadata = {
  'fc:frame': 'vNext',
  'fc:frame:image': frameConfig.heroImage,
  'fc:frame:button:1': 'Launch App',
  'fc:frame:button:1:action': 'launch_frame',
  'fc:frame:button:1:target': frameConfig.appUrl,
  'fc:frame:button:1:post_url': `${frameConfig.appUrl}/api/frame`,
};
