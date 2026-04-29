import { useState, useCallback, useMemo, useEffect, createContext, useContext } from 'react';
import { apiClient } from '@/lib/api';
import type { AuthResponse, LoginInput, AdminRole } from '@shared/types';

type Permission =
  | 'view_dashboard'
  | 'view_jobs'
  | 'create_jobs'
  | 'edit_jobs'
  | 'toggle_jobs'
  | 'delete_jobs'
  | 'view_users'
  | 'manage_users';

const PERMISSIONS: Record<AdminRole, Permission[]> = {
  admin: ['view_dashboard', 'view_jobs', 'create_jobs', 'edit_jobs', 'toggle_jobs', 'delete_jobs', 'view_users', 'manage_users'],
  editor: ['view_dashboard', 'view_jobs', 'create_jobs', 'edit_jobs', 'toggle_jobs'],
};

interface AuthState {
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  role: AdminRole | null;
  isAdmin: boolean;
  isEditor: boolean;
  hasPermission: (action: Permission) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, try to refresh token from httpOnly cookie (only on admin pages)
  useEffect(() => {
    const isAdminPage = window.location.pathname.startsWith('/admin');
    if (!isAdminPage) {
      setIsLoading(false);
      return;
    }

    const apiBase = import.meta.env.VITE_API_URL || '/api';
    fetch(`${apiBase}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          apiClient.setToken(data.accessToken);
          setUser(data.user);
        }
      })
      .catch(() => {
        // No valid session, stay logged out
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (data: LoginInput) => {
    const response = await apiClient.login(data);
    apiClient.setToken(response.accessToken);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    await apiClient.logout();
    apiClient.setToken(null);
    setUser(null);
  }, []);

  const role = user?.role || null;
  const isAdmin = role === 'admin';
  const isEditor = role === 'editor';

  const hasPermission = useCallback((action: Permission) => {
    if (!role) return false;
    return PERMISSIONS[role].includes(action);
  }, [role]);

  const value = useMemo<AuthState>(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    role,
    isAdmin,
    isEditor,
    hasPermission,
  }), [user, isLoading, login, logout, role, isAdmin, isEditor, hasPermission]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
