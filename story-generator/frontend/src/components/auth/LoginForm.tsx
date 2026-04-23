import { useState, FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';

function EyeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

function RevealButton({ show, onToggle, label }: { show: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center -m-1 text-ink-tertiary hover:text-ink-secondary rounded focus:outline-none focus:ring-2 focus:ring-brand bg-surface z-10"
    >
      {show ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  );
}

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, apiKey.trim() || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-ink mb-1.5">
          E-Mail
        </label>
        <input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-edge rounded-lg px-3.5 py-2.5 text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent placeholder:text-ink-tertiary"
          placeholder="name@beispiel.de"
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-ink mb-1.5">
          Passwort
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-edge rounded-lg px-3.5 py-2.5 pr-12 text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent placeholder:text-ink-tertiary"
            placeholder="Passwort eingeben"
            autoComplete="current-password"
          />
          <RevealButton
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
          />
        </div>
      </div>

      <div>
        <label htmlFor="login-apikey" className="block text-sm font-medium text-ink mb-1.5">
          Anthropic API-Key
        </label>
        <div className="relative">
          <input
            id="login-apikey"
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full border border-edge rounded-lg px-3.5 py-2.5 pr-12 text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent placeholder:text-ink-tertiary"
            placeholder="sk-ant-…"
            autoComplete="off"
            aria-describedby="login-apikey-hint"
          />
          <RevealButton
            show={showApiKey}
            onToggle={() => setShowApiKey((v) => !v)}
            label={showApiKey ? 'API-Key verbergen' : 'API-Key anzeigen'}
          />
        </div>
        <p className="mt-1.5 text-xs text-ink-tertiary" id="login-apikey-hint">
          Beginnt mit «sk-ant-». Findest du unter{' '}
          <a
            href="https://console.anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            console.anthropic.com
          </a>
        </p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand hover:bg-brand-dark text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface mt-2"
      >
        {loading ? 'Anmelden…' : 'Anmelden'}
      </button>
    </form>
  );
}
