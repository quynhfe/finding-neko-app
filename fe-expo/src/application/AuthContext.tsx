import React, {createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import type {User} from '@/types/domain';
import * as authApi from '@/services/authApi';

type AuthState = {
  user: User | null;
  initializing: boolean;
  loading: boolean;
  error: string | null;
  signIn(input: {identifier: string; password: string}): Promise<void>;
  signUp(input: {username: string; email: string; password: string}): Promise<string>;
  verifyRegistrationOtp(input: {username: string; email: string; password: string; otp: string}): Promise<string>;
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

function throwReadableError(error: unknown): never {
  throw new Error(readableError(error));
}

export function AuthProvider({children}: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    authApi
      .getMe()
      .then(nextUser => mounted && setUser(nextUser))
      .catch(() => mounted && setUser(null))
      .finally(() => mounted && setInitializing(false));
    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (input: {identifier: string; password: string}) => {
    setError(null);
    setLoading(true);
    try {
      setUser(await authApi.login(input));
    } catch (err) {
      const message = readableError(err);
      setError(message);
      throwReadableError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (input: {username: string; email: string; password: string}) => {
    setError(null);
    setLoading(true);
    try {
      const result = await authApi.register(input);
      return result.email;
    } catch (err) {
      const message = readableError(err);
      setError(message);
      throwReadableError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyRegistrationOtp = useCallback(async (input: {username: string; email: string; password: string; otp: string}) => {
    setError(null);
    setLoading(true);
    try {
      const result = await authApi.verifyRegisterOtp(input);
      return result.message;
    } catch (err) {
      const message = readableError(err);
      setError(message);
      throwReadableError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      loading,
      error,
      signIn,
      signUp,
      verifyRegistrationOtp,
      signOut,
    }),
    [error, initializing, loading, signIn, signOut, signUp, user, verifyRegistrationOtp],
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
