import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_LOVABLE_URL;
const anonKey = import.meta.env.VITE_LOVABLE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Defina VITE_LOVABLE_URL e VITE_LOVABLE_ANON_KEY da Lovable Cloud no arquivo .env');
}

// Atenção: usamos a SDK supabase-js somente como cliente HTTP.
// O backend deste projeto é a Lovable Cloud (interno do Lovable), não supabase.com externo.
export const supabase = createClient(url, anonKey);
