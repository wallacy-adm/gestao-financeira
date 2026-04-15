create extension if not exists "uuid-ossp";

create table if not exists public.app_users (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  pin text not null check (pin ~ '^[0-9]{6}$'),
  full_name text not null,
  company_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null check (type in ('receita', 'despesa')),
  company_id text not null,
  created_by uuid not null references public.app_users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default uuid_generate_v4(),
  description text not null,
  amount numeric(12,2) not null check (amount > 0),
  type text not null check (type in ('receita', 'despesa')),
  category_id uuid not null references public.categories(id),
  company_id text not null,
  occurred_at date not null,
  created_by uuid not null references public.app_users(id),
  created_at timestamptz not null default now()
);

alter table public.app_users enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

create policy "users can read themselves" on public.app_users
for select using (true);

create policy "company categories" on public.categories
for all using (true) with check (true);

create policy "company transactions" on public.transactions
for all using (true) with check (true);

insert into public.app_users (username, pin, full_name, company_id)
values
  ('admin.acme', '123456', 'Administrador ACME', 'acme'),
  ('admin.beta', '654321', 'Administrador BETA', 'beta')
on conflict do nothing;
