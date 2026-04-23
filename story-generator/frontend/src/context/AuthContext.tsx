import React, { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client';
import type { User } from '../types';

const API_KEY_SESSION_KEY = 'anthropic_api_key';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  apiKey: string | null;
  setApiKey: (key: string) => void;
  login: (email: string, password: string, apiKey?: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKeyState] = useState<string | null>(
    () => sessionStorage.getItem(API_KEY_SESSION_KEY),
  );

  useEffect(() => {
    client
      .get<{ user: User }>('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const setApiKey = (key: string) => {
    sessionStorage.setItem(API_KEY_SESSION_KEY, key);
    setApiKeyState(key);
  };

  const login = async (email: string, password: string, apiKeyParam?: string) => {
    const res = await client.post<{ user: User }>('/auth/login', { email, password });
    setUser(res.data.user);
    if (apiKeyParam) {
      setApiKey(apiKeyParam);
    }
  };

  const register = async (email: string, password: string) => {
    const res = await client.post<{ user: User }>('/auth/register', { email, password });
    setUser(res.data.user);
  };

  const logout = async () => {
    await client.post('/auth/logout');
    sessionStorage.removeItem(API_KEY_SESSION_KEY);
    setApiKeyState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, apiKey, setApiKey, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
