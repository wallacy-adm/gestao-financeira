# Gestão Financeira (Desktop-first + PWA)

Aplicação React + Vite para gestão financeira com:

- Login por `usuário + senha de 6 dígitos`.
- Banco na Lovable Cloud via `supabase-js`.
- Dashboard com gráficos (Recharts).
- CRUD de categorias e transações.
- Suporte multiempresa por `company_id`.
- PWA instalável (manifest + service worker).
- Ícone em formato SVG (evita erro de PR com binários).

## Rodando local

```bash
npm install
cp .env.example .env
npm run dev
```

## Banco (Lovable Cloud)

1. Crie um projeto no Lovable Cloud / Supabase compatível.
2. Execute `supabase/schema.sql` no SQL Editor.
3. Preencha `.env` com URL e anon key.

## Observações de segurança

- O exemplo guarda `pin` no banco para simplicidade do MVP.
- Em produção, substituir por hash + fluxo de auth robusto.

## Build

```bash
npm run build
npm run preview
```
