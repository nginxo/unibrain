import { createClient, SupabaseClient } from '@supabase/supabase-js';

const ensureConfig = (): { url: string; anonKey: string } => {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  if (!url || !anonKey) {
    throw new Error('Supabase non configurato. Definisci VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
  }
  return { url, anonKey };
};

let client: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (client) return client;
  const { url, anonKey } = ensureConfig();
  client = createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true }
  });
  return client;
};

// Nota: la creazione del bucket richiede la Service Role Key (solo server-side).
// In client non possiamo creare bucket. Assumiamo che esista già.
export const ensureBucket = async (_bucket = 'notes') => {
  return;
};

