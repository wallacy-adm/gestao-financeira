export type AppUser = {
  id: string;
  username: string;
  company_id: string;
  full_name: string;
};

export type Category = {
  id: string;
  name: string;
  type: 'receita' | 'despesa';
  company_id: string;
  created_by: string;
};

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: 'receita' | 'despesa';
  category_id: string;
  company_id: string;
  occurred_at: string;
  created_by: string;
  category?: Pick<Category, 'name' | 'type'>;
};
