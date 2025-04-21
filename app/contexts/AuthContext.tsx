'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkAuth, login, register, logout, User, LoginParams, RegisterParams } from '@/app/lib/auth';

// 身份驗證上下文狀態類型
export interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  user: User | null;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterParams) => Promise<boolean>;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now());

  // 清除錯誤信息
  const clearError = () => {
    setError(null);
  };

  // 檢查用戶是否已通過身份驗證
  const refreshAuth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/check');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          // 確保管理員用戶自動被標記為會員
          const userData = {
            ...data.user,
            isMember: data.user.role === 'admin' ? true : data.user.isMember
          };
          setUser(userData);
          setIsLoggedIn(true);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          setUser(null);
          setIsLoggedIn(false);
          localStorage.removeItem('user');
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('檢查身份驗證出錯:', error);
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  // 使用useCallback包裝refreshAuth，避免不必要的函數重建
  const memoizedRefreshAuth = React.useCallback(refreshAuth, [isLoggedIn, user, loading, error]);

  // 初始檢查
  useEffect(() => {
    let isMounted = true;
    
    const initAuth = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
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
          setLoading(false);
        }
      }
    };
    
    initAuth();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  // 定期刷新身份驗證
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isLoggedIn) return;
    
    // 定義刷新間隔（15分鐘）
    const REFRESH_INTERVAL = 15 * 60 * 1000;
    
    // 創建定時器
    const refreshTimer = setInterval(() => {
      const timeSinceLastRefresh = Date.now() - lastRefreshTime;
      
      // 如果距離上次刷新超過10分鐘，則進行刷新
      if (timeSinceLastRefresh > 10 * 60 * 1000) {
        console.log('AuthContext: 定時刷新身份驗證');
        refreshAuth();
      }
    }, REFRESH_INTERVAL);
    
    // 清理函數
    return () => {
      clearInterval(refreshTimer);
    };
  }, [isLoggedIn, lastRefreshTime]);
  
  // 頁面活動監聽
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isLoggedIn) return;
    
    // 處理頁面變為活動時刷新身份驗證
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const timeSinceLastRefresh = Date.now() - lastRefreshTime;
        
        // 如果不可見超過30分鐘，則在頁面變為可見時刷新身份驗證
        if (timeSinceLastRefresh > 30 * 60 * 1000) {
          console.log('AuthContext: 頁面變為活動，刷新身份驗證');
          refreshAuth();
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLoggedIn, lastRefreshTime]);
  
  // 路由變化監聽
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isLoggedIn) return;
    
    // 處理路由變化時刷新身份驗證
    const handleRouteChange = () => {
      const timeSinceLastRefresh = Date.now() - lastRefreshTime;
      
      // 如果距離上次刷新超過5分鐘，則在路由變化時刷新身份驗證
      if (timeSinceLastRefresh > 5 * 60 * 1000) {
        console.log('AuthContext: 路由變化，刷新身份驗證');
        refreshAuth();
      }
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [isLoggedIn, lastRefreshTime]);
  
  // 處理登入
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('嘗試登入:', email);
      
      // 發送登入請求 - 改為使用 PUT 方法，而不是 POST
      const response = await fetch('/api/auth', {
        method: 'PUT', // 修改為 PUT 方法，因為 auth/route.ts 使用 PUT 處理登入
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      // 解析響應結果
      const data = await response.json();
      console.log('登入響應:', data);
      
      // 檢查響應狀態
      if (!response.ok) {
        const errorMsg = data.error || '登入失敗，請檢查您的憑證';
        console.error('登入失敗:', errorMsg);
        setError(errorMsg);
        setLoading(false);
        return false;
      }
      
      // 登入成功，更新狀態
      setIsLoggedIn(true);
      
      // 確保 data.user 包含所有必要的用戶信息
      if (data.user) {
        // 確保管理員用戶自動被視為會員
        const userData = {
          ...data.user,
          isMember: data.user.role === 'admin' ? true : !!data.user.isMember
        };
        
        setUser(userData);
        
        // 保存用戶信息到本地存儲
        try {
          localStorage.setItem('yellairlines_user', JSON.stringify(userData));
        } catch (e) {
          console.error('無法保存用戶數據到本地存儲:', e);
        }
        
        // 更新最後刷新時間
        setLastRefreshTime(Date.now());
        
        setLoading(false);
        return true;
      } else {
        console.error('登入響應中缺少用戶資料');
        setError('登入響應中缺少用戶資料');
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('登入處理過程中發生錯誤:', error);
      setError('登入過程中發生錯誤，請稍後再試');
      setLoading(false);
      return false;
    }
  };
  
  // 用戶註冊
  const handleRegister = async (userData: RegisterParams): Promise<any> => {
    try {
      setLoading(true);
      
      // 調用 API 註冊
      const result = await register(userData);
      
      if (result.authenticated && result.user) {
        setIsLoggedIn(true);
        setUser(result.user);
        setError(null);
        
        // 更新本地存儲
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('yellairlines_user', JSON.stringify(result.user));
        }
        
        // 添加成功標誌
        return { success: true };
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setError(result.error || '註冊失敗');
        return { 
          success: false, 
          error: result.error || '註冊失敗，請稍後再試'
        };
      }
    } catch (error: any) {
      console.error('註冊過程中發生錯誤:', error);
      setIsLoggedIn(false);
      setUser(null);
      setError('註冊過程中發生錯誤');
      return { 
        success: false, 
        error: '註冊過程中發生錯誤: ' + (error.message || '未知錯誤')
      };
    } finally {
      setLoading(false);
    }
  };
  
  // 登出處理
  const handleLogout = async (): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('AuthContext: 嘗試登出');
      
      const response = await logout();
      console.log('AuthContext: 登出響應', response);
      
      // 清除本地存儲的用戶數據
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('yellairlines_user');
        } catch (err) {
          console.error('清除本地存儲失敗:', err);
        }
      }
      
      setIsLoggedIn(false);
      setUser(null);
      setError(null);
      
      // 處理本地存儲操作
      if (response.localStorage) {
        try {
          const { key, remove } = response.localStorage;
          
          if (remove && key) {
            localStorage.removeItem(key);
          }
        } catch (err) {
          console.error('本地存儲操作失敗:', err);
        }
      }
      
      return true;
    } catch (error: any) {
      console.error('登出失敗:', error);
      setError(error.message || '登出失敗，請稍後再試');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // 獲取用戶認證令牌的方法
  const getToken = async (): Promise<string | null> => {
    // 如果當前未登入，返回null
    if (!isLoggedIn || !user) {
      return null;
    }

    try {
      // 這裡簡單返回用戶ID作為令牌
      // 在實際應用中，這裡應該使用JWT令牌或其他認證方式
      return user.id;
    } catch (error) {
      console.error('獲取令牌失敗:', error);
      return null;
    }
  };
  
  // 添加更新用户資料的方法
  const updateUser = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('更新用戶資料失敗');
        return false;
      }

      const data = await response.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      }
      return true;
    } catch (error) {
      console.error('更新用戶資料錯誤', error);
      return false;
    }
  };
  
  // 提供身份驗證上下文值
  const contextValue: AuthContextType = {
    isLoggedIn,
    loading,
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

// 身份驗證上下文使用鉤子
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 