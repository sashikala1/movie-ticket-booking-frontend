import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Role, User } from '../types';
import { storage } from '../utils/storage';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  signup: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const decodeToken = (token: string): Partial<User> | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '='));
    const parsed = JSON.parse(json) as { sub?: string; role?: string; email?: string; name?: string };

    return {
      email: parsed.email ?? parsed.sub,
      role: (parsed.role?.replace('ROLE_', '') as Role) ?? 'CUSTOMER',
      name: parsed.name,
    };
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(storage.getToken());
  const [user, setUser] = useState<User | null>(storage.getUser() as User | null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = storage.getToken();
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      const nextUser = decoded ? { ...decoded, email: decoded.email ?? 'user@example.com' } : null;
      setUser(nextUser ?? null);
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const persistAuth = (nextToken: string) => {
    const decoded = decodeToken(nextToken);
    const nextUser = decoded ? { ...decoded, email: decoded.email ?? 'user@example.com' } : null;
    setToken(nextToken);
    setUser(nextUser);
    storage.setToken(nextToken);
    if (nextUser) storage.setUser(nextUser as Record<string, unknown>);
  };

  const login = (nextToken: string) => persistAuth(nextToken);
  const signup = (nextToken: string) => persistAuth(nextToken);

  const logout = () => {
    setToken(null);
    setUser(null);
    storage.clearAll();
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      isLoading,
      login,
      signup,
      logout,
    }),
    [token, user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
