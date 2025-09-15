# UniBrain 📄

UniBrain is a web app designed for university students to share and access their notes online.  
Built with modern web technologies for speed, simplicity, and collaboration.

# Urbe.eth

This project was built at Urbe.eth’s campus, where their team supported us in refining our ideas and turning them into a live product.

Go check them out!

X: https://x.com/urbeEth 

Farcaster: https://farcaster.xyz/urbe-eth 

Website: https://urbe.build/

## Features

- ⚡️ Vite for fast development and building
- ⚛️ React 18 with TypeScript
- 🎨 Tailwind CSS for styling
- 🔧 ESLint for code linting
- 📦 Supabase for storage & authentication (optional)

## Getting Started (Run Locally)

1. **Clone the repository**
   ```bash
   git clone https://github.com/nginxo/unibrain.git
   cd unibrain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file in the root directory with:
   ```env
   VITE_APP_URL=http://localhost:5173
   VITE_APP_NAME=UniBrain
   VITE_HERO_IMAGE=/hero.png
   VITE_SPLASH_IMAGE=/splash.png
   VITE_SPLASH_BG_COLOR=#ffffff
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

   > If you don’t plan to use Supabase, you can leave those fields empty or remove them.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. Open your browser and visit 👉 [http://localhost:5173](http://localhost:5173)

## Project Structure

```
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Main app pages
│   ├── lib/         # Utilities and helpers
│   └── App.tsx      # Root component
├── .env             # Environment variables
├── package.json
└── vite.config.ts
```

## Available Scripts

- `npm run dev` → Start development server
- `npm run build` → Build for production
- `npm run preview` → Preview production build
- `npm run lint` → Run ESLint

## Optional: Supabase Setup

If you want to enable Supabase for storing notes:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)  
2. Create a new project  
3. Create a **bucket** in Storage named `notes` (set it as Public)  
4. Add policies:

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

Update `.env` with your project’s URL and anon key.

## Learn More

- [Farcaster Mini Apps Documentation](https://docs.farcaster.xyz/learn/what-is-farcaster/frames/mini-apps)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

