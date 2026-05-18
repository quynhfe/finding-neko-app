import React, {createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import type {User} from '@/types/domain';
import * as authApi from '@/services/authApi';

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn(input: {email: string; password: string}): Promise<void>;
  signUp(input: {fullName: string; email: string; password: string}): Promise<void>;
  signOut(): Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

function readableError(error: unknown) {
  if (typeof error === 'object' && error && 'response' in error) {
    const maybe = error as {response?: {data?: {message?: string | string[]}}};
    const message = maybe.response?.data?.message;
    return Array.isArray(message) ? message.join('\n') : message || 'Không thể kết nối máy chủ.';
  }
  return 'Không thể kết nối máy chủ.';
}

export function AuthProvider({children}: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    authApi
      .getMe()
      .then(nextUser => mounted && setUser(nextUser))
      .catch(() => mounted && setUser(null))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (input: {email: string; password: string}) => {
    setError(null);
    setLoading(true);
    try {
      setUser(await authApi.login(input));
    } catch (err) {
      setError(readableError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (input: {fullName: string; email: string; password: string}) => {
    setError(null);
    setLoading(true);
    try {
      setUser(await authApi.register(input));
    } catch (err) {
      setError(readableError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({user, loading, error, signIn, signUp, signOut}),
    [error, loading, signIn, signOut, signUp, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
