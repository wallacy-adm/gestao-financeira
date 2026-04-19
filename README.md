# Gestão Financeira (Desktop-first + PWA)

Aplicação React + Vite para gestão financeira com:

- Login por `usuário + senha de 6 dígitos`.
- Banco na **Lovable Cloud** (interno do Lovable).
- Dashboard com gráficos (Recharts).
- CRUD de categorias e transações.
- Suporte multiempresa por `company_id`.
- PWA instalável (manifest + service worker).
- Ícone em formato SVG (evita erro de PR com binários).

## Regra importante sobre o banco

> **Este projeto deve usar somente a Lovable Cloud (banco interno do Lovable).**
>
> **Não usar `supabase.com` externo neste projeto.**

### Por que existe `@supabase/supabase-js` no código?

- `@supabase/supabase-js` é apenas a biblioteca cliente utilizada para conversar com o backend da Lovable Cloud.
- O uso dessa SDK **não significa** que o projeto está usando Supabase externo.

## Rodando local

```bash
npm install
cp .env.example .env
npm run dev
```

## Banco (Lovable Cloud)

1. Crie/configure o projeto na **Lovable Cloud**.
2. Execute `supabase/schema.sql` no SQL Editor do ambiente da Lovable Cloud.
3. Preencha `.env` com URL e anon key da Lovable Cloud.

## Observações de segurança

- O exemplo guarda `pin` no banco para simplicidade do MVP.
- Em produção, substituir por hash + fluxo de auth robusto.

## Build

```bash
npm run build
npm run preview
```