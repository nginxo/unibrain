# Farcaster Mini App Setup Guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Farcaster Mini App Configuration
VITE_APP_URL=https://your-app-domain.com
VITE_APP_NAME=UniBrain
VITE_HERO_IMAGE=https://your-app-domain.com/hero-image.png
VITE_SPLASH_IMAGE=https://your-app-domain.com/splash-image.png
VITE_SPLASH_BG_COLOR=#ffffff

# Supabase Configuration (optional)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Required Images

You need to create and host the following images:

1. **Hero Image** (`hero-image.png`): 1200x630px - Main frame image
2. **Splash Image** (`splash-image.png`): 1200x630px - Loading screen image
3. **OG Image** (`og-image.png`): 1200x630px - Open Graph image for social sharing
4. **Icon** (`icon.png`): 512x512px - App icon

## Deployment Steps

1. **Deploy your app** to a public URL (Vercel, Netlify, etc.)
2. **Update environment variables** with your actual domain
3. **Upload images** to your domain and update URLs in environment variables
4. **Test the frame** using Farcaster's developer tools

## Testing

1. Enable Developer Mode in Farcaster
2. Go to [Mini Apps Preview](https://farcaster.xyz/~/developers/mini-apps/preview)
3. Enter your app's URL and test the frame

## Frame Manifest

The app includes a Farcaster manifest at `public/.well-known/farcaster.json` that needs to be updated with your actual URLs and information.
