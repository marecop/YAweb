'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  miles: number;
  level: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 檢查是否已登入
  useEffect(() => {
    const verifyUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('驗證使用者失敗', err);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);

  // 登入函數
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '登入失敗');
      }

      setUser(data.user);
      return data;
    } catch (err: any) {
      setError(err.message || '登入失敗');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 註冊函數
  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '註冊失敗');
      }

      setUser(data.user);
      return data;
    } catch (err: any) {
      setError(err.message || '註冊失敗');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出函數
  const logout = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '登出失敗');
      }

      setUser(null);
      router.push('/');
    } catch (err: any) {
      setError(err.message || '登出失敗');
      console.error('登出錯誤', err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoggedIn: !!user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth 必須在 AuthProvider 內使用');
  }
  return context;
}