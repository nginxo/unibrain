# StudyNFT App - Setup

## Requisiti
- Node 18+
- MetaMask nel browser
- Account Supabase con un progetto attivo

## Ambiente
Creare `.env.local`:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Bucket Storage (obbligatorio)
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

## Avvio
```
npm ci
npm run dev
```

Oppure:
```
npx vite --port 5173
```

## Upload Note
Upload su bucket `notes` con prefisso `<prezzoETH>__<titolo>__...`.

## Wallet
Connect su Base, acquisto con `eth_sendTransaction` verso indirizzo merchant (prompt iniziale).


