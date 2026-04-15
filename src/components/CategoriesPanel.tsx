import { FormEvent, useState } from 'react';
import { createCategory, deleteCategory, updateCategory } from '../lib/financeApi';
import type { AppUser, Category } from '../types';

type Props = {
  categories: Category[];
  user: AppUser;
  reload: () => Promise<void>;
};

export default function CategoriesPanel({ categories, user, reload }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'receita' | 'despesa'>('despesa');

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    await createCategory({
      name,
      type,
      company_id: user.company_id,
      created_by: user.id
    });
    setName('');
    await reload();
  }

  async function handleInlineEdit(category: Category): Promise<void> {
    const nextName = prompt('Novo nome da categoria', category.name);
    if (!nextName) return;
    await updateCategory(category.id, { name: nextName, type: category.type });
    await reload();
  }

  async function handleDelete(id: string): Promise<void> {
    if (!confirm('Remover categoria?')) return;
    await deleteCategory(id);
    await reload();
  }

  return (
    <section className="card">
      <h2>Categorias</h2>
      <form className="inline-form" onSubmit={handleCreate}>
        <input required placeholder="Nome da categoria" value={name} onChange={(e) => setName(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value as 'receita' | 'despesa')}>
          <option value="despesa">Despesa</option>
          <option value="receita">Receita</option>
        </select>
        <button type="submit">Adicionar</button>
      </form>

      <ul className="list">
        {categories.map((category) => (
          <li key={category.id}>
            <span>
              {category.name} <small>({category.type})</small>
            </span>
            <div className="actions">
              <button onClick={() => handleInlineEdit(category)}>Editar</button>
              <button className="danger" onClick={() => handleDelete(category.id)}>
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
