/**
 * 此腳本用於直接修復AuthContextType類型定義
 */

const fs = require('fs');
const path = require('path');

console.log('開始直接修復AuthContext中的類型定義...');

// 定義要修改的文件路徑
const authContextPath = path.join(process.cwd(), 'app/contexts/AuthContext.tsx');

if (fs.existsSync(authContextPath)) {
  console.log(`找到AuthContext文件：${authContextPath}`);
  
  // 讀取文件內容
  let content = fs.readFileSync(authContextPath, 'utf8');
  
  // 直接替換整個AuthContextType接口
  console.log('直接替換AuthContextType接口定義...');
  
  // 強制替換接口定義，無需正則匹配
  const newInterface = `export interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateUser: () => Promise<boolean>;
  getToken: () => Promise<string | null>;
  clearError: () => void;
}`;
  
  // 正則表達式用於匹配整個AuthContextType接口
  // 使用多個不同模式嘗試匹配
  const patterns = [
    /export\s+interface\s+AuthContextType\s*{[\s\S]*?}/,
    /export\s+type\s+AuthContextType\s*=\s*{[\s\S]*?}/,
    /interface\s+AuthContextType\s*{[\s\S]*?}/
  ];
  
  let replaced = false;
  for (const pattern of patterns) {
    if (pattern.test(content)) {
      console.log(`找到匹配的接口定義模式: ${pattern.toString().slice(0, 30)}...`);
      content = content.replace(pattern, newInterface);
      replaced = true;
      break;
    }
  }
  
  if (!replaced) {
    console.log('未找到匹配的接口定義模式，嘗試搜索接口開始位置...');
    
    // 尋找接口開始的位置
    const interfaceStart = content.indexOf('export interface AuthContextType');
    const typeStart = content.indexOf('export type AuthContextType');
    const start = interfaceStart !== -1 ? interfaceStart : typeStart;
    
    if (start !== -1) {
      console.log(`找到接口定義開始位置: ${start}`);
      
      // 尋找接口結束的位置
      let braceCount = 0;
      let endIndex = -1;
      
      for (let i = start; i < content.length; i++) {
        if (content[i] === '{') braceCount++;
        if (content[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i + 1;
            break;
          }
        }
      }
      
      if (endIndex !== -1) {
        console.log(`找到接口定義結束位置: ${endIndex}`);
        
        // 替換整個接口定義
        content = content.substring(0, start) + newInterface + content.substring(endIndex);
        replaced = true;
      }
    }
  }
  
  if (!replaced) {
    console.error('❌ 無法找到或替換AuthContextType接口定義');
    
    // 直接寫入完整的AuthContext文件
    console.log('嘗試寫入完整的AuthContext文件...');
    
    const fullAuthContextContent = `'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkAuth, login, register, logout, User } from '@/app/lib/auth';

// 身份驗證上下文狀態類型
export interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateUser: () => Promise<boolean>;
  getToken: () => Promise<string | null>;
  clearError: () => void;
}

// 創建身份驗證上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 身份驗證上下文提供者屬性
interface AuthProviderProps {
  children: ReactNode;
}

// 身份驗證上下文提供者
export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now());

  // 清除錯誤信息
  const clearError = () => {
    setError(null);
  };

  // 初始檢查
  useEffect(() => {
    let isMounted = true;
    
    const initAuth = async () => {
      if (!isMounted) return;
      
      try {
        setIsLoading(true);
        console.log('AuthContext: 初始化認證狀態');
        
        const authResponse = await checkAuth();
        console.log('AuthContext: 初始認證響應', authResponse);
        
        if (!isMounted) return;
        
        if (authResponse.authenticated && authResponse.user) {
          setIsLoggedIn(true);
          setUser(authResponse.user);
          console.log('AuthContext: 初始設置用戶數據', authResponse.user);
          
          // 保存到本地存儲
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('yellairlines_user', JSON.stringify(authResponse.user));
            } catch (err) {
              console.error('無法保存用戶數據到本地存儲:', err);
            }
          }
        } else {
          setIsLoggedIn(false);
          setUser(null);
          
          // 清除本地存儲中的用戶數據
          if (typeof window !== 'undefined') {
            try {
              localStorage.removeItem('yellairlines_user');
            } catch (err) {
              console.error('無法清除本地存儲中的用戶數據:', err);
            }
          }
        }
        
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        
        console.error('AuthContext: 初始認證檢查失敗', err);
        setIsLoggedIn(false);
        setUser(null);
        setError('初始身份驗證檢查失敗');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    initAuth();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // 處理登入
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('嘗試登入:', email);
      
      // 發送登入請求
      const response = await login(email, password);
      console.log('登入響應:', response);
      
      if (response.error) {
        setError(response.error);
        setIsLoading(false);
        return false;
      }
      
      // 登入成功，更新狀態
      if (response.authenticated && response.user) {
        setIsLoggedIn(true);
        setUser(response.user);
        
        // 更新最後刷新時間
        setLastRefreshTime(Date.now());
        
        // 保存到本地存儲
        if (typeof window !== 'undefined' && response.localStorage) {
          try {
            localStorage.setItem(response.localStorage.key, response.localStorage.value);
          } catch (err) {
            console.error('無法保存到本地存儲:', err);
          }
        }
        
        setIsLoading(false);
        return true;
      } else {
        setError('登入失敗');
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      console.error('登入過程中發生錯誤:', error);
      setError(error.message || '登入過程中發生錯誤');
      setIsLoading(false);
      return false;
    }
  };

  // 處理註冊
  const handleRegister = async (firstName: string, lastName: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('嘗試註冊:', email);
      
      // 發送註冊請求
      const response = await register(firstName, lastName, email, password);
      console.log('註冊響應:', response);
      
      if (response.error) {
        setError(response.error);
        setIsLoading(false);
        return false;
      }
      
      // 註冊成功，更新狀態
      if (response.authenticated && response.user) {
        setIsLoggedIn(true);
        setUser(response.user);
        
        // 更新最後刷新時間
        setLastRefreshTime(Date.now());
        
        // 保存到本地存儲
        if (typeof window !== 'undefined' && response.localStorage) {
          try {
            localStorage.setItem(response.localStorage.key, response.localStorage.value);
          } catch (err) {
            console.error('無法保存到本地存儲:', err);
          }
        }
        
        setIsLoading(false);
        return true;
      } else {
        setError('註冊失敗');
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      console.error('註冊過程中發生錯誤:', error);
      setError(error.message || '註冊過程中發生錯誤');
      setIsLoading(false);
      return false;
    }
  };

  // 處理登出
  const handleLogout = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('嘗試登出');
      
      // 發送登出請求
      const response = await logout();
      console.log('登出響應:', response);
      
      // 更新狀態
      setIsLoggedIn(false);
      setUser(null);
      
      // 清除本地存儲中的用戶數據
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('yellairlines_user');
        } catch (err) {
          console.error('無法清除本地存儲中的用戶數據:', err);
        }
      }
      
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('登出過程中發生錯誤:', error);
      setError(error.message || '登出過程中發生錯誤');
      setIsLoading(false);
      return false;
    }
  };

  // 獲取身份驗證令牌
  const getToken = async (): Promise<string | null> => {
    // 從本地存儲中獲取令牌
    if (typeof window !== 'undefined') {
      try {
        const userDataStr = localStorage.getItem('yellairlines_user');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          return userData.token || null;
        }
      } catch (err) {
        console.error('無法從本地存儲獲取用戶令牌:', err);
      }
    }
    
    return null;
  };

  // 更新用戶數據
  const updateUser = async (): Promise<boolean> => {
    try {
      const authResponse = await checkAuth();
      
      if (authResponse.authenticated && authResponse.user) {
        setUser(authResponse.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('更新用戶數據出錯:', error);
      return false;
    }
  };

  // 創建上下文值
  const contextValue: AuthContextType = {
    isLoggedIn,
    isLoading,
    user,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUser,
    getToken,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定義鉤子
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth必須在AuthProvider內部使用');
  }
  
  return context;
}`;
    
    // 寫入完整的文件內容
    fs.writeFileSync(authContextPath, fullAuthContextContent, 'utf8');
    
    console.log('✅ 已寫入完整的AuthContext文件');
    process.exit(0); // 強制結束腳本，避免繼續執行後續操作
  }
  
  // 確保contextValue中使用isLoading而不是loading
  console.log('處理contextValue中的屬性名稱...');
  
  if (content.includes('loading,') || content.includes('loading:')) {
    // 替換contextValue中的loading為isLoading
    content = content.replace(
      /(\s*)(loading)(\s*)(,|:)/g,
      '$1isLoading$3$4'
    );
    
    console.log('✅ 已修復contextValue中的屬性名稱');
  }
  
  // 修改狀態變量名稱
  console.log('處理組件中的狀態變量名稱...');
  
  if (content.includes('const [loading, setLoading]') || 
      content.includes('loading, setLoading') ||
      content.match(/\[\s*loading\s*,\s*setLoading\s*\]/)) {
    
    // 修改狀態聲明
    content = content.replace(
      /const\s*\[\s*loading\s*,\s*setLoading\s*\]\s*=\s*useState/g,
      'const [isLoading, setIsLoading] = useState'
    );
    
    // 修改setLoading的使用
    content = content.replace(/setLoading\s*\(/g, 'setIsLoading(');
    
    console.log('✅ 已修復組件中的狀態變量名稱');
  }
  
  // 替換所有獨立的loading引用
  console.log('處理所有獨立的loading引用...');
  
  // 將獨立的loading引用改為isLoading
  const lines = content.split('\n');
  let updatedContent = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 跳過已處理過的行或不適合處理的行
    if (line.includes('setIsLoading') || 
        line.includes('isLoading,') || 
        line.includes('isLoading =') ||
        line.includes('isLoading:') ||
        line.includes('= isLoading') ||
        line.includes('AuthContextType')) {
      updatedContent += line + '\n';
      continue;
    }
    
    // 替換loading為isLoading，但要避免替換變量聲明等
    const updatedLine = line.replace(/\bloading\b(?!\s*[,.:=])/g, 'isLoading');
    updatedContent += updatedLine + '\n';
  }
  
  content = updatedContent.trim();
  console.log('✅ 已處理所有獨立的loading引用');
  
  // 寫入修改後的內容
  fs.writeFileSync(authContextPath, content, 'utf8');
  console.log('✅ 已修復AuthContext中的類型定義問題');
} else {
  console.error(`❌ 找不到AuthContext文件：${authContextPath}`);
}

console.log('AuthContext類型定義修復完成'); 