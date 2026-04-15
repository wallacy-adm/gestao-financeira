import { FormEvent, useState } from 'react';
import { createTransaction, deleteTransaction, updateTransaction } from '../lib/financeApi';
import type { AppUser, Category, Transaction } from '../types';

type Props = {
  categories: Category[];
  transactions: Transaction[];
  user: AppUser;
  reload: () => Promise<void>;
};

export default function TransactionsPanel({ categories, transactions, user, reload }: Props) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState<'receita' | 'despesa'>('despesa');
  const [occurredAt, setOccurredAt] = useState(() => new Date().toISOString().slice(0, 10));

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!categoryId) return;

    await createTransaction({
      description,
      amount: Number(amount),
      category_id: categoryId,
      type,
      occurred_at: occurredAt,
      company_id: user.company_id,
      created_by: user.id
    });

    setDescription('');
    setAmount('');
    await reload();
  }

  async function handleEdit(transaction: Transaction): Promise<void> {
    const nextDescription = prompt('Descrição', transaction.description);
    if (!nextDescription) return;

    await updateTransaction(transaction.id, {
      description: nextDescription,
      amount: Number(transaction.amount),
      type: transaction.type,
      category_id: transaction.category_id,
      occurred_at: transaction.occurred_at
    });

    await reload();
  }

  async function handleDelete(id: string): Promise<void> {
    if (!confirm('Remover transação?')) return;
    await deleteTransaction(id);
    await reload();
  }

  return (
    <section className="card">
      <h2>Transações</h2>
      <form className="grid-form" onSubmit={handleCreate}>
        <input required placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input
          required
          type="number"
          step="0.01"
          placeholder="Valor"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select required value={type} onChange={(e) => setType(e.target.value as 'receita' | 'despesa')}>
          <option value="despesa">Despesa</option>
          <option value="receita">Receita</option>
        </select>
        <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Categoria</option>
          {categories
            .filter((category) => category.type === type)
            .map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
        </select>
        <input type="date" value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} />
        <button type="submit">Salvar</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.occurred_at}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category?.name ?? '-'}</td>
              <td>{transaction.type}</td>
              <td>R$ {Number(transaction.amount).toFixed(2)}</td>
              <td className="actions">
                <button onClick={() => handleEdit(transaction)}>Editar</button>
                <button className="danger" onClick={() => handleDelete(transaction.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
