import { supabase } from './supabase';
import type { AppUser } from '../types';

const SESSION_KEY = 'gf.session';

export async function loginWithUsername(username: string, pin: string): Promise<AppUser> {
  const { data, error } = await supabase
    .from('app_users')
    .select('id, username, company_id, full_name, pin')
    .eq('username', username)
    .single();

  if (error || !data) {
    throw new Error('Usuário não encontrado.');
  }

  if (data.pin !== pin || pin.length !== 6) {
    throw new Error('Senha inválida. Use 6 dígitos numéricos.');
  }

  const sessionUser: AppUser = {
    id: data.id,
    username: data.username,
    company_id: data.company_id,
    full_name: data.full_name
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

export function getSessionUser(): AppUser | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as AppUser;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}
