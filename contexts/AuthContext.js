'use client';

/**
 * AuthContext — provides auth state across the entire app.
 *
 * Values exposed:
 *   user     — current user object or null
 *   loading  — true while the initial /auth/me check is in flight
 *   error    — last auth error message or null
 *   login()  — call with { email, password }, resolves with user
 *   logout() — clears token + user, redirects to /
 *   clearError() — resets the error state
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { login as apiLogin, logout as apiLogout, fetchMe } from '@/services/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until /auth/me resolves
  const [error, setError] = useState(null);

  // Hydrate user from token on mount
  useEffect(() => {
    fetchMe()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    setError(null);
    setLoading(true);
    try {
      const data = await apiLogin(credentials);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    await apiLogout();
    setUser(null);
    setLoading(false);
    router.push('/');
  }, [router]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook — must be used inside <AuthProvider> */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
