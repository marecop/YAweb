'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  login: async () => false,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // 模擬登入
    setUser({ 
      id: '1', 
      email, 
      firstName: 'User', 
      lastName: 'Name', 
      role: 'user',
      memberLevel: 1,
      isMember: true
    });
    return true;
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 