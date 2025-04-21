'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  memberLevel?: number;
  isMember?: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // 檢查是否已經登入（從 localStorage 獲取數據）
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const clearError = () => {
    setError(null);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // 模擬 API 呼叫延遲
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 簡單的驗證
      if (!email || !password) {
        setError('請填寫電子郵件和密碼');
        setLoading(false);
        return false;
      }
      
      if (password.length < 6) {
        setError('密碼必須至少包含 6 個字符');
        setLoading(false);
        return false;
      }
      
      // 模擬登入成功
      const mockUser: User = { 
        id: '1', 
        email, 
        firstName: email.split('@')[0], 
        lastName: 'User', 
        role: email.includes('admin') ? 'admin' : 'user',
        memberLevel: 2,
        isMember: true
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error('登入失敗:', err);
      setError('登入失敗，請稍後再試');
      setLoading(false);
      return false;
    }
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      // 模擬 API 呼叫延遲
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 簡單的驗證
      if (!userData.email || !userData.password) {
        setError('請填寫電子郵件和密碼');
        setLoading(false);
        return false;
      }
      
      if (userData.password.length < 6) {
        setError('密碼必須至少包含 6 個字符');
        setLoading(false);
        return false;
      }
      
      // 模擬註冊成功
      const mockUser: User = { 
        id: '2', 
        email: userData.email, 
        firstName: userData.firstName || userData.email.split('@')[0], 
        lastName: userData.lastName || 'User', 
        role: 'user',
        memberLevel: 1,
        isMember: true
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error('註冊失敗:', err);
      setError('註冊失敗，請稍後再試');
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      // 模擬 API 呼叫延遲
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setUser(null);
      localStorage.removeItem('user');
      
      // 選擇性：導航到首頁
      router.push('/');
    } catch (err) {
      console.error('登出失敗:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        error,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 