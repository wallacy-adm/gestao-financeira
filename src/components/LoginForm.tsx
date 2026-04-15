import { FormEvent, useState } from 'react';
import { loginWithUsername } from '../lib/auth';
import type { AppUser } from '../types';

type Props = {
  onLogin: (user: AppUser) => void;
};

export default function LoginForm({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!/^\d{6}$/.test(pin)) {
      setError('A senha deve conter exatamente 6 dígitos numéricos.');
      return;
    }

    try {
      setIsLoading(true);
      const user = await loginWithUsername(username, pin);
      onLogin(user);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Falha ao autenticar');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-wrapper">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Gestão Financeira</h1>
        <p className="subtitle">Desktop-first + PWA + multiempresa</p>
        <label>
          Usuário
          <input required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="seu.usuario" />
        </label>
        <label>
          Senha (6 dígitos)
          <input
            required
            inputMode="numeric"
            maxLength={6}
            minLength={6}
            pattern="\\d{6}"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="******"
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button disabled={isLoading} type="submit">
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
