// 引入用戶類型
import type { User } from '../types';

// 導出 User 類型以便其他文件使用
export type { User };

// 用戶介面定義
export type UserData = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  memberLevel?: number;
  isMember?: boolean;
  password: string;
  totalMiles?: number;
  createdAt?: string;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  country?: string;
  city?: string;
  postalCode?: string;
};

// 登入參數介面
export interface LoginParams {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 註冊參數介面
export interface RegisterParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// 身份驗證響應介面
export interface AuthResponse {
  authenticated: boolean;
  user?: User;
  error?: string;
  success?: boolean;
  localStorage?: {
    key: string;
    value: string;
    remove?: string;
  };
}

// 登入/註冊響應介面
export interface UserResponse {
  user: User;
  message: string;
  error?: string;
  localStorage?: {
    key?: string;
    value?: string;
    remove?: string;
  };
}

// 檢查用戶是否已登入
export async function checkAuth(): Promise<AuthResponse> {
  try {
    console.log('檢查身份驗證');
    
    // 添加超時處理
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超時
    
    const response = await fetch('/api/auth', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache', // 避免緩存問題
      },
      credentials: 'include', // 包含 cookies
      signal: controller.signal,
      cache: 'no-store' // 確保獲取最新數據
    });
    
    clearTimeout(timeoutId);
    
    console.log('身份驗證檢查完成', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        return { authenticated: false };
      }
      throw new Error('檢查身份驗證時出錯: ' + response.status);
    }
    
    const data = await response.json();
    console.log('身份驗證響應數據', data);
    
    return {
      authenticated: !!data.authenticated,
      user: data.user,
      error: data.error
    };
  } catch (error: any) {
    console.error('認證檢查失敗:', error);
    
    // 檢查是否為超時錯誤
    if (error.name === 'AbortError') {
      return { authenticated: false, error: '身份驗證請求超時' };
    }
    
    return { authenticated: false, error: '檢查身份驗證時出錯: ' + (error.message || '未知錯誤') };
  }
}

// 用戶登入
export async function login(params: LoginParams): Promise<AuthResponse> {
  try {
    console.log('發送登入請求');
    
    // 添加超時處理
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超時
    
    const response = await fetch('/api/auth', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      credentials: 'include', // 包含 cookies
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('登入請求完成', response.status);
    const data = await response.json();
    console.log('登入響應數據', data);
    
    return {
      authenticated: !!data.authenticated || !!data.user,
      user: data.user,
      error: data.error,
      localStorage: data.localStorage || {
        key: "userSession",
        value: ""
      }
    };
  } catch (error: any) {
    console.error('登入失敗:', error);
    
    // 檢查是否為超時錯誤
    if (error.name === 'AbortError') {
      const emptyLocalStorage = {
        key: "userSession",
        value: ""
      };
      return {
        authenticated: false,
        user: {} as User,
        error: '登入請求超時，請檢查網絡連接',
        localStorage: emptyLocalStorage
      };
    }
    
    const emptyLocalStorage = {
      key: "userSession",
      value: ""
    };
    return {
      authenticated: false,
      user: {} as User,
      error: '登入過程中發生錯誤: ' + (error.message || '未知錯誤'),
      localStorage: emptyLocalStorage
    };
  }
}

// 用戶註冊
export async function register(firstName: string, lastName: string, email: string, password: string): Promise<AuthResponse> {
  try {
    console.log('發送註冊請求');
    
    // 添加超時處理
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超時
    
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, password }),
      credentials: 'include', // 包含 cookies
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('註冊請求完成', response.status);
    const data = await response.json();
    console.log('註冊響應數據', data);
    
    return {
      authenticated: !!data.authenticated || !!data.user,
      user: data.user,
      error: data.error,
      localStorage: data.localStorage || {
        key: "userSession",
        value: ""
      }
    };
  } catch (error: any) {
    console.error('註冊失敗:', error);
    
    // 檢查是否為超時錯誤
    if (error.name === 'AbortError') {
      const emptyLocalStorage = {
        key: "userSession",
        value: ""
      };
      return {
        authenticated: false,
        user: {} as User,
        error: '註冊請求超時，請檢查網絡連接',
        localStorage: emptyLocalStorage
      };
    }
    
    const emptyLocalStorage = {
      key: "userSession",
      value: ""
    };
    return {
      authenticated: false,
      user: {} as User,
      error: '註冊過程中發生錯誤: ' + (error.message || '未知錯誤'),
      localStorage: emptyLocalStorage
    };
  }
}

// 用戶登出
export async function logout(): Promise<AuthResponse> {
  try {
    console.log('正在登出');
    
    // 添加超時處理
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('/api/auth', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 包含 cookies
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('登出請求完成', response.status);
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || '登出過程中出錯');
    }
    
    // 登出成功
    return {
      authenticated: false,
      localStorage: {
        key: "userSession",
        value: "",
        remove: "true"
      }
    };
  } catch (error: any) {
    console.error('登出失敗:', error);
    
    // 檢查是否為超時錯誤
    if (error.name === 'AbortError') {
      return { 
        authenticated: false, 
        error: '登出請求超時', 
        localStorage: {
          key: "userSession",
          value: "",
          remove: "true"
        }
      };
    }
    
    return { 
      authenticated: false, 
      error: '登出過程中發生錯誤: ' + (error.message || '未知錯誤'),
      localStorage: {
        key: "userSession",
        value: "",
        remove: "true"
      }
    };
  }
}

// 更新用戶資料
export async function updateUserProfile(
  userId: string,
  userData: Partial<Omit<User, 'id' | 'email' | 'password'>>
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '更新個人資料時出錯');
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error: any) {
    console.error('更新個人資料失敗:', error);
    return {
      success: false,
      error: '更新個人資料時出錯: ' + (error.message || '未知錯誤'),
    };
  }
} 