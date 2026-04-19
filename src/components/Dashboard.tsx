import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Category, Transaction } from '../types';

type Props = {
  categories: Category[];
  transactions: Transaction[];
};

export default function Dashboard({ categories, transactions }: Props) {
  const summary = useMemo(() => {
    const receitas = transactions.filter((t) => t.type === 'receita').reduce((acc, t) => acc + Number(t.amount), 0);
    const despesas = transactions.filter((t) => t.type === 'despesa').reduce((acc, t) => acc + Number(t.amount), 0);
    return {
      receitas,
      despesas,
      saldo: receitas - despesas
    };
  }, [transactions]);

  const byCategory = useMemo(() => {
    const mapping = new Map<string, number>();
    transactions.forEach((tx) => {
      const categoryName = categories.find((category) => category.id === tx.category_id)?.name ?? 'Sem categoria';
      const current = mapping.get(categoryName) ?? 0;
      mapping.set(categoryName, current + Number(tx.amount));
    });

    return Array.from(mapping.entries()).map(([name, amount]) => ({ name, amount }));
  }, [categories, transactions]);

  const monthly = useMemo(() => {
    const mapping = new Map<string, { receita: number; despesa: number }>();

    transactions.forEach((tx) => {
      const month = format(new Date(tx.occurred_at), 'MMM/yyyy', { locale: ptBR });
      const row = mapping.get(month) ?? { receita: 0, despesa: 0 };
      row[tx.type] += Number(tx.amount);
      mapping.set(month, row);
    });

    return Array.from(mapping.entries()).map(([month, values]) => ({ month, ...values }));
  }, [transactions]);

  return (
    <section className="dashboard-grid">
      <article className="card metric">
        <h3>Receitas</h3>
        <strong>R$ {summary.receitas.toFixed(2)}</strong>
      </article>
      <article className="card metric">
        <h3>Despesas</h3>
        <strong>R$ {summary.despesas.toFixed(2)}</strong>
      </article>
      <article className="card metric">
        <h3>Saldo</h3>
        <strong className={summary.saldo < 0 ? 'negative' : 'positive'}>R$ {summary.saldo.toFixed(2)}</strong>
      </article>

      <article className="card chart-card">
        <h3>Movimento mensal</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="receita" fill="#22c55e" />
            <Bar dataKey="despesa" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </article>

      <article className="card chart-card">
        <h3>Distribuição por categoria</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={byCategory} dataKey="amount" nameKey="name" outerRadius={100} label>
              {byCategory.map((entry, index) => (
                <Cell key={entry.name} fill={["#3b82f6", "#8b5cf6", "#14b8a6", "#f59e0b", "#ef4444"][index % 5]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </article>
    </section>
  );
}
