import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_LOVABLE_URL;
const anonKey = import.meta.env.VITE_LOVABLE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Defina VITE_LOVABLE_URL e VITE_LOVABLE_ANON_KEY no arquivo .env');
}

export const supabase = createClient(url, anonKey);
