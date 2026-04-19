# Documentação completa do projeto `gestao-financeira`

> Documento de referência total do estado atual do projeto.
> Objetivo: explicar tudo o que existe no repositório, sem ambiguidade.

---

## 1) Visão geral

Este projeto é um **MVP de gestão financeira desktop-first com PWA** construído em:

- **React 18 + TypeScript + Vite**
- **Recharts** para gráficos
- **date-fns** para formatação de datas
- **Lovable Cloud** como backend de dados (acessado com SDK `@supabase/supabase-js`)

Funcionalidades principais entregues:

1. Login com **usuário + PIN de 6 dígitos**.
2. Isolamento de dados por **`company_id`** (multiempresa).
3. Dashboard com métricas e gráficos.
4. CRUD de categorias.
5. CRUD de transações.
6. PWA instalável com manifest e service worker.

---

## 2) Regra de backend (ponto crítico)

### Obrigatório

- O banco deste projeto é a **Lovable Cloud (interno do Lovable)**.
- **Não usar `supabase.com` externo** para este projeto.

### Observação técnica

- A biblioteca `@supabase/supabase-js` aparece no código **apenas como cliente HTTP/SDK** para conversar com a Lovable Cloud.
- Isso **não muda** a regra de backend acima.

---

## 3) Estrutura de pastas e arquivos

```text
.
├── .env.example
├── README.md
├── DOCUMENTACAO_COMPLETA.md
├── index.html
├── package.json
├── public/
│   └── icon.svg
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   ├── types.ts
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── Dashboard.tsx
│   │   ├── CategoriesPanel.tsx
│   │   └── TransactionsPanel.tsx
│   └── lib/
│       ├── supabase.ts
│       ├── auth.ts
│       └── financeApi.ts
├── supabase/
│   └── schema.sql
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 4) Front-end: fluxo completo da aplicação

### 4.1 Bootstrap

- `src/main.tsx` inicializa a aplicação React.
- Registra o service worker via `virtual:pwa-register`.

### 4.2 Tela de login

- Componente: `src/components/LoginForm.tsx`.
- Campos:
  - `username`
  - `pin` (somente numérico, exatamente 6 dígitos)
- Regras:
  - regex `^\d{6}$`
  - exibe erro se inválido
- Ao autenticar com sucesso:
  - salva sessão local
  - entrega usuário para `App.tsx`

### 4.3 Sessão

- Arquivo: `src/lib/auth.ts`
- Chave de sessão local: `gf.session`
- Métodos:
  - `loginWithUsername(username, pin)`
  - `getSessionUser()`
  - `logout()`

### 4.4 Shell e navegação

- Arquivo: `src/App.tsx`
- Estado principal:
  - usuário logado
  - categorias
  - transações
  - aba ativa (`dashboard`, `categorias`, `transacoes`)
- Navegação simples por tabs (sem react-router).

### 4.5 Dashboard

- Componente: `src/components/Dashboard.tsx`
- Exibe:
  - total de receitas
  - total de despesas
  - saldo
  - gráfico de barras por mês (receita x despesa)
  - gráfico de pizza por categoria

### 4.6 Categorias (CRUD)

- Componente: `src/components/CategoriesPanel.tsx`
- Operações:
  - criar categoria
  - editar nome (prompt)
  - excluir categoria

### 4.7 Transações (CRUD)

- Componente: `src/components/TransactionsPanel.tsx`
- Operações:
  - criar transação
  - editar descrição (prompt)
  - excluir transação
- Campos:
  - descrição
  - valor
  - tipo (receita/despesa)
  - categoria compatível com tipo
  - data

### 4.8 Estilos / Desktop-first

- Arquivo: `src/styles.css`
- Estratégia:
  - layout principal pensado para desktop
  - breakpoints para telas menores (responsivo)
  - tema escuro

---

## 5) Camada de dados

### 5.1 Cliente Lovable Cloud

Arquivo: `src/lib/supabase.ts`

- Lê as variáveis:
  - `VITE_LOVABLE_URL`
  - `VITE_LOVABLE_ANON_KEY`
- Se faltar alguma, lança erro de configuração.

### 5.2 API de domínio

Arquivo: `src/lib/financeApi.ts`

Métodos para categorias:

- `listCategories(companyId)`
- `createCategory(payload)`
- `updateCategory(id, payload)`
- `deleteCategory(id)`

Métodos para transações:

- `listTransactions(companyId)`
- `createTransaction(payload)`
- `updateTransaction(id, payload)`
- `deleteTransaction(id)`

Todos os métodos usam a Lovable Cloud e filtram dados por `company_id`.

---

## 6) Tipos TypeScript

Arquivo: `src/types.ts`

Modelos:

- `AppUser`
- `Category`
- `Transaction`

Campos relevantes:

- `company_id` em usuário/categoria/transação
- `type` em categoria/transação (`receita` | `despesa`)

---

## 7) Banco de dados (SQL)

Arquivo: `supabase/schema.sql`

### Tabelas

1. `app_users`
   - `id`, `username`, `pin`, `full_name`, `company_id`, `created_at`
2. `categories`
   - `id`, `name`, `type`, `company_id`, `created_by`, `created_at`
3. `transactions`
   - `id`, `description`, `amount`, `type`, `category_id`, `company_id`, `occurred_at`, `created_by`, `created_at`

### Regras de integridade

- `pin` com check de 6 dígitos
- `type` em receita/despesa
- `amount > 0`
- FKs entre transações/categorias/usuários

### RLS / políticas

- RLS habilitado nas três tabelas.
- Políticas atualmente permissivas (MVP).

### Seed inicial

- `admin.acme` / `123456` / `company_id = acme`
- `admin.beta` / `654321` / `company_id = beta`

---

## 8) PWA

### Configuração

Arquivo: `vite.config.ts`

- Plugin: `vite-plugin-pwa`
- `registerType: autoUpdate`
- Manifest com:
  - `name`, `short_name`, `theme_color`, `background_color`, `display`, `start_url`
  - ícone `public/icon.svg`

### Entrada HTML

Arquivo: `index.html`

- Meta theme-color
- Favicon em SVG

### Registro do SW

Arquivo: `src/main.tsx`

- `registerSW({ immediate: true })`

---

## 9) Variáveis de ambiente

Arquivo: `.env.example`

Obrigatórias:

- `VITE_LOVABLE_URL`
- `VITE_LOVABLE_ANON_KEY`

Atenção:

- usar credenciais da **Lovable Cloud**
- não usar supabase.com externo

---

## 10) Scripts NPM

Arquivo: `package.json`

- `npm run dev` → ambiente de desenvolvimento
- `npm run build` → build de produção (`tsc -b && vite build`)
- `npm run preview` → preview da build
- `npm run lint` → lint com ESLint

---

## 11) Como executar do zero

1. Instalar dependências:

```bash
npm install
```

2. Criar `.env`:

```bash
cp .env.example .env
```

3. Preencher variáveis da Lovable Cloud no `.env`.

4. Executar o SQL de schema/seed no ambiente da Lovable Cloud.

5. Subir frontend:

```bash
npm run dev
```

---

## 12) Fluxo multiempresa (`company_id`)

- Usuário autenticado possui `company_id`.
- `App.tsx` carrega categorias/transações filtrando por esse `company_id`.
- Ao criar categoria/transação, `company_id` é gravado no registro.

Resultado: cada empresa vê apenas seu próprio conjunto de dados (de acordo com filtros do app e regras de backend).

---

## 13) Segurança (estado atual e próximos passos)

### Atual (MVP)

- PIN armazenado no banco para simplicidade.
- Sessão armazenada em `localStorage`.
- RLS com políticas permissivas.

### Recomendado para produção

1. Hash de senha/PIN (nunca texto plano).
2. Fluxo robusto de autenticação (JWT + refresh + expiração).
3. Políticas RLS restritivas por usuário/empresa.
4. Auditoria de ações e trilha de eventos.
5. Tratamento de erros e telemetria.

---

## 14) Limitações conhecidas

1. Edição de categoria/transação via `prompt` (UX simples de MVP).
2. Sem testes automatizados implementados.
3. Sem paginação/filtros avançados nas listagens.
4. Camada de autenticação simplificada.

---

## 15) Histórico recente de ajustes relevantes

1. Migração de ícones PNG para SVG para evitar erro de PR com binários.
2. Clareza documental de que o backend é Lovable Cloud interno.
3. Ajustes textuais em `.env.example`, `README.md`, `src/lib/supabase.ts`.

---

## 16) Checklist funcional (para validar manualmente)

- [ ] Login com usuário válido e PIN de 6 dígitos.
- [ ] Erro ao informar PIN inválido.
- [ ] Carregamento de dashboard após login.
- [ ] Criação, edição e exclusão de categorias.
- [ ] Criação, edição e exclusão de transações.
- [ ] Filtro de dados por empresa (`company_id`).
- [ ] Instalação PWA e funcionamento em modo standalone.

---

## 17) Arquivos-chave para manutenção

- `README.md` → guia rápido
- `DOCUMENTACAO_COMPLETA.md` → guia completo
- `supabase/schema.sql` → estrutura de banco
- `src/lib/supabase.ts` → conexão com backend
- `src/lib/financeApi.ts` → CRUD e consultas
- `src/App.tsx` → orquestração de telas/estado

---

Se houver mudança de regra de negócio, atualize este arquivo junto com o `README.md`.
