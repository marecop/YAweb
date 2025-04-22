const fs = require('fs');
const path = require('path');

console.log('開始修復登入頁面中的語法錯誤...');

// login/page.tsx 的路徑
const loginPagePath = path.join(process.cwd(), 'app', 'auth', 'login', 'page.tsx');

// 創建一個正確的登入頁面內容
const correctLoginPageContent = `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { login, isLoading: loading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    clearError();
    
    console.log('嘗試登入:', email);
    
    try {
      const success = await login(email, password);
      console.log('登入結果:', success);
      
      if (success) {
        // 獲取重定向 URL（如果有）
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect') || '/member';
        
        console.log('登入成功，準備重定向到:', redirectUrl);
        
        // 使用 window.location 進行硬重定向，確保頁面完全重新加載
        window.location.href = redirectUrl;
      } else {
        console.error('登入失敗');
        // 登入失敗信息已經由 AuthContext 處理
      }
    } catch (err) {
      console.error('登入時發生錯誤:', err);
      setErrorMessage('登入時發生錯誤。請稍後再試。');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">登入您的帳戶</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          或{' '}
          <Link href="/auth/register" className="font-medium text-ya-yellow-600 hover:text-ya-yellow-500">
            註冊新帳戶
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {(error || errorMessage) && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error || errorMessage}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                電子郵件地址
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密碼
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-ya-yellow-600 focus:ring-ya-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                  記住我
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-ya-yellow-600 hover:text-ya-yellow-500">
                  忘記密碼?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={\`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500 \${loading ? 'opacity-70 cursor-not-allowed' : ''}\`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    處理中...
                  </>
                ) : '登入'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}`;

// 確保目錄存在
const loginPageDir = path.dirname(loginPagePath);
if (!fs.existsSync(loginPageDir)) {
  fs.mkdirSync(loginPageDir, { recursive: true });
  console.log('已創建目錄: app/auth/login');
}

// 先檢查是否存在問題
if (fs.existsSync(loginPagePath)) {
  const currentContent = fs.readFileSync(loginPagePath, 'utf8');
  
  // 檢查是否有語法錯誤 (多個冒號)
  if (currentContent.includes('isLoading: isLoading:')) {
    console.log('檢測到雙冒號問題，將修復 isLoading: isLoading: 錯誤');
  }
  
  // 檢查是否已經是正確的內容
  if (currentContent.includes('const { login, isLoading: loading, error, clearError } = useAuth();')) {
    console.log('登入頁面語法看起來已經正確');
  } else {
    console.log('登入頁面需要更新');
  }
}

// 無論如何，都直接覆蓋整個文件，確保沒有錯誤
try {
  fs.writeFileSync(loginPagePath, correctLoginPageContent, { encoding: 'utf8', flag: 'w' });
  console.log('已完全重寫登入頁面，確保沒有語法錯誤');
  
  // 檢查寫入後的內容
  const afterContent = fs.readFileSync(loginPagePath, 'utf8');
  const correctLine = 'const { login, isLoading: loading, error, clearError } = useAuth();';
  if (afterContent.includes(correctLine)) {
    console.log('確認: 登入頁面已包含正確的 isLoading: loading 語法');
  } else {
    console.error('警告: 登入頁面內容驗證失敗');
  }
} catch (err) {
  console.error('寫入登入頁面時發生錯誤:', err);
}

// 還要檢查 AuthContext.tsx，確保它的 contextValue 是正確的
const authContextPath = path.join(process.cwd(), 'app', 'contexts', 'AuthContext.tsx');
if (fs.existsSync(authContextPath)) {
  console.log('檢查 AuthContext.tsx...');
  let authContextContent = fs.readFileSync(authContextPath, 'utf8');
  
  // 修改 contextValue 中的 loading 屬性名稱
  if (authContextContent.includes('const contextValue: AuthContextType = {') && 
      authContextContent.includes('loading,')) {
    console.log('發現 contextValue 中使用了 loading，需要修改為 isLoading: loading');
    
    authContextContent = authContextContent.replace(
      /loading,/g,
      'isLoading: loading,'
    );
    
    fs.writeFileSync(authContextPath, authContextContent, { encoding: 'utf8', flag: 'w' });
    console.log('已更新 AuthContext.tsx 中的 contextValue');
    
    // 檢查修改後的內容
    const afterAuthContent = fs.readFileSync(authContextPath, 'utf8');
    if (afterAuthContent.includes('isLoading: loading,')) {
      console.log('確認: AuthContext 已更新為 isLoading: loading');
    } else {
      console.error('警告: AuthContext 內容驗證失敗');
    }
  } else if (authContextContent.includes('isLoading: loading,')) {
    console.log('AuthContext.tsx 中的 contextValue 已經正確設定為 isLoading: loading');
  }
}

console.log('登入頁面語法錯誤修復完成'); 