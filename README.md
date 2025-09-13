# UniBrain - Farcaster Mini App

A decentralized marketplace for AI-generated content built as a Farcaster mini app.

## Features

- 🎯 Farcaster Mini App integration
- ⚡️ Vite for fast development and building
- ⚛️ React 18 with TypeScript
- 🎨 Tailwind CSS for styling
- 🔧 ESLint for code linting
- 📦 Modern build setup

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```env
   VITE_APP_URL=https://your-app-domain.com
   VITE_APP_NAME=UniBrain
   VITE_HERO_IMAGE=https://your-app-domain.com/hero-image.png
   VITE_SPLASH_IMAGE=https://your-app-domain.com/splash-image.png
   VITE_SPLASH_BG_COLOR=#ffffff
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

## Farcaster Mini App Setup

This app is configured as a Farcaster mini app with the following features:

- **Frame Metadata**: Proper Open Graph and Farcaster frame meta tags
- **Frame SDK**: Uses `@farcaster/frame-sdk` for frame interactions
- **Launch Frame**: Configured to launch as a mini app within Farcaster
- **API Endpoints**: Frame API endpoint for handling user interactions

### Frame Configuration

The app includes:
- Hero image for frame display
- Launch button with proper action
- Frame API endpoint at `/api/frame`
- Proper metadata for Farcaster discovery

### Deployment

1. Deploy your app to a public URL (Vercel, Netlify, etc.)
2. Update the environment variables with your actual domain
3. Ensure your frame images are accessible at the specified URLs
4. Test the frame in Farcaster by sharing the URL

## Supabase Setup (Optional)

If using Supabase for data storage:

1. Supabase Dashboard → Storage → Create bucket: `notes` (Public)
2. Policies (SQL):

```sql
alter table storage.objects enable row level security;

create policy "Public read notes"
on storage.objects
for select
to public
using (bucket_id = 'notes');

create policy "Anon insert notes"
on storage.objects
for insert
to public
with check (bucket_id = 'notes');
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Learn More

- [Farcaster Mini Apps Documentation](https://docs.farcaster.xyz/learn/what-is-farcaster/frames/mini-apps)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)


