import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onSwitch: () => void;
}

export function LoginForm({ onSwitch }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? 'Login fehlgeschlagen');
      } else {
        setError('Login fehlgeschlagen');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          placeholder="name@beispiel.de"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand hover:bg-brand-dark text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Anmelden…' : 'Anmelden'}
      </button>

      <p className="text-sm text-center text-gray-500">
        Noch kein Account?{' '}
        <button type="button" onClick={onSwitch} className="text-brand hover:underline font-medium">
          Registrieren
        </button>
      </p>
    </form>
  );
}
