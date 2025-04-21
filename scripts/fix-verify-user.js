const fs = require('fs');
const path = require('path');

console.log('開始修復驗證使用者檔案...');

// 檢查並修復 AuthContext.tsx
const authContextPath = path.join(process.cwd(), 'app', 'contexts', 'AuthContext.tsx');
const authContextDir = path.dirname(authContextPath);

// 確保目錄存在
if (!fs.existsSync(authContextDir)) {
  fs.mkdirSync(authContextDir, { recursive: true });
  console.log('已創建 contexts 目錄');
}

// 更新或創建 AuthContext.tsx
const authContextContent = `'use client';

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
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
    isLoading,
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
}`;

fs.writeFileSync(authContextPath, authContextContent);
console.log('已更新 AuthContext.tsx');

// 創建檢查使用者API路由
const checkAuthPath = path.join(process.cwd(), 'app', 'api', 'auth', 'check', 'route.ts');
const checkAuthDir = path.dirname(checkAuthPath);

if (!fs.existsSync(checkAuthDir)) {
  fs.mkdirSync(checkAuthDir, { recursive: true });
  console.log('已創建檢查認證目錄');
}

const checkAuthContent = `import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { users } from '@/data/users';

export async function GET() {
  try {
    // 從cookie獲取使用者ID
    const authToken = cookies().get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: '未登入' },
        { status: 401 }
      );
    }

    // 查找使用者
    const user = users.find(u => u.id === authToken);
    
    if (!user) {
      return NextResponse.json(
        { error: '使用者不存在' },
        { status: 401 }
      );
    }

    // 返回使用者資訊 (排除密碼)
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('檢查使用者失敗', error);
    return NextResponse.json(
      { error: '檢查使用者過程發生錯誤' },
      { status: 500 }
    );
  }
}`;

fs.writeFileSync(checkAuthPath, checkAuthContent);
console.log('已創建檢查認證API');

// 創建登出API路由
const logoutPath = path.join(process.cwd(), 'app', 'api', 'auth', 'logout', 'route.ts');
const logoutDir = path.dirname(logoutPath);

if (!fs.existsSync(logoutDir)) {
  fs.mkdirSync(logoutDir, { recursive: true });
  console.log('已創建登出目錄');
}

const logoutContent = `import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // 刪除認證cookie
    cookies().delete('auth-token');
    
    return NextResponse.json({
      message: '已成功登出'
    });
  } catch (error) {
    console.error('登出錯誤', error);
    return NextResponse.json(
      { error: '登出過程發生錯誤' },
      { status: 500 }
    );
  }
}`;

fs.writeFileSync(logoutPath, logoutContent);
console.log('已創建登出API');

// 確保RootLayout使用AuthProvider
const rootLayoutPath = path.join(process.cwd(), 'app', 'layout.tsx');

if (fs.existsSync(rootLayoutPath)) {
  let layoutContent = fs.readFileSync(rootLayoutPath, 'utf8');
  
  // 檢查是否已包含AuthProvider
  if (!layoutContent.includes('AuthProvider')) {
    // 添加導入
    if (!layoutContent.includes("import { AuthProvider }")) {
      layoutContent = layoutContent.replace(
        "import React from 'react';", 
        "import React from 'react';\nimport { AuthProvider } from './contexts/AuthContext';"
      );
      
      if (!layoutContent.includes("import { AuthProvider }")) {
        // 如果沒有React導入，添加新導入
        layoutContent = `import { AuthProvider } from './contexts/AuthContext';\n${layoutContent}`;
      }
    }
    
    // 添加Provider包裹
    layoutContent = layoutContent.replace(
      /<body[^>]*>([\s\S]*?)<\/body>/,
      (match, bodyContent) => {
        return match.replace(
          bodyContent,
          `\n        <AuthProvider>\n          ${bodyContent.trim()}\n        </AuthProvider>\n      `
        );
      }
    );
    
    fs.writeFileSync(rootLayoutPath, layoutContent);
    console.log('已更新RootLayout以包含AuthProvider');
  } else {
    console.log('RootLayout已包含AuthProvider');
  }
} else {
  console.log('找不到RootLayout文件');
}

console.log('驗證使用者修復完成'); 