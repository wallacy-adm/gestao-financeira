import { supabase } from './supabase';
import type { Category, Transaction } from '../types';

type NewCategory = Pick<Category, 'name' | 'type' | 'company_id' | 'created_by'>;
type NewTransaction = Pick<
  Transaction,
  'description' | 'amount' | 'type' | 'category_id' | 'company_id' | 'occurred_at' | 'created_by'
>;

export async function listCategories(companyId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('company_id', companyId)
    .order('name');

  if (error) throw error;
  return data as Category[];
}

export async function createCategory(payload: NewCategory): Promise<void> {
  const { error } = await supabase.from('categories').insert(payload);
  if (error) throw error;
}

export async function updateCategory(id: string, payload: Pick<Category, 'name' | 'type'>): Promise<void> {
  const { error } = await supabase.from('categories').update(payload).eq('id', id);
  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

export async function listTransactions(companyId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, category:categories(name, type)')
    .eq('company_id', companyId)
    .order('occurred_at', { ascending: false });

  if (error) throw error;
  return data as Transaction[];
}

export async function createTransaction(payload: NewTransaction): Promise<void> {
  const { error } = await supabase.from('transactions').insert(payload);
  if (error) throw error;
}

export async function updateTransaction(
  id: string,
  payload: Pick<Transaction, 'description' | 'amount' | 'type' | 'category_id' | 'occurred_at'>
): Promise<void> {
  const { error } = await supabase.from('transactions').update(payload).eq('id', id);
  if (error) throw error;
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw error;
}
