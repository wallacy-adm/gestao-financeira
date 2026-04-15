import { useEffect, useMemo, useState } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import CategoriesPanel from './components/CategoriesPanel';
import TransactionsPanel from './components/TransactionsPanel';
import { getSessionUser, logout } from './lib/auth';
import { listCategories, listTransactions } from './lib/financeApi';
import type { AppUser, Category, Transaction } from './types';

export default function App() {
  const [user, setUser] = useState<AppUser | null>(() => getSessionUser());
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'categorias' | 'transacoes'>('dashboard');

  const ready = useMemo(() => Boolean(user), [user]);

  async function reloadData() {
    if (!user) return;
    try {
      setError(null);
      const [categoriesData, transactionsData] = await Promise.all([
        listCategories(user.company_id),
        listTransactions(user.company_id)
      ]);
      setCategories(categoriesData);
      setTransactions(transactionsData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Erro ao carregar dados');
    }
  }

  useEffect(() => {
    void reloadData();
  }, [user]);

  if (!user) {
    return <LoginForm onLogin={(logged) => setUser(logged)} />;
  }

  return (
    <main className="app-shell">
      <header>
        <div>
          <h1>Olá, {user.full_name}</h1>
          <small>Empresa: {user.company_id}</small>
        </div>
        <button
          onClick={() => {
            logout();
            setUser(null);
          }}
        >
          Sair
        </button>
      </header>

      {error && <p className="error card">{error}</p>}

      {ready && (
        <>
          <nav className="tabs">
            <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
              Dashboard
            </button>
            <button className={activeTab === 'categorias' ? 'active' : ''} onClick={() => setActiveTab('categorias')}>
              Categorias
            </button>
            <button className={activeTab === 'transacoes' ? 'active' : ''} onClick={() => setActiveTab('transacoes')}>
              Transações
            </button>
          </nav>

          {activeTab === 'dashboard' && <Dashboard categories={categories} transactions={transactions} />}
          {activeTab === 'categorias' && <CategoriesPanel categories={categories} user={user} reload={reloadData} />}
          {activeTab === 'transacoes' && (
            <TransactionsPanel categories={categories} transactions={transactions} user={user} reload={reloadData} />
          )}
        </>
      )}
    </main>
  );
}
