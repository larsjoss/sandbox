import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginForm } from '../components/auth/LoginForm';

export function AuthPage() {
  const { user } = useAuth();

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <main className="w-full max-w-sm" aria-label="Anmeldung">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Story Generator</h1>
          <p className="text-sm text-gray-500 mt-1">Anforderungen in Stories verwandeln</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Anmelden</h2>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
