/**
 * 此腳本用於特別修復Render部署中出現的login($1)問題
 */

const fs = require('fs');
const path = require('path');

console.log('開始專門修復login($1)問題...');

const loginPagePath = path.join(process.cwd(), 'app/auth/login/page.tsx');

if (fs.existsSync(loginPagePath)) {
  console.log(`找到登入頁面文件：${loginPagePath}`);
  
  // 讀取文件內容
  let content = fs.readFileSync(loginPagePath, 'utf8');
  
  // 檢查是否有問題
  if (content.includes('login($1)')) {
    console.log('發現問題：login($1)');
    
    // 替換為正確的調用方式
    content = content.replace('login($1)', 'login(email, password)');
    
    // 寫回文件
    fs.writeFileSync(loginPagePath, content, 'utf8');
    console.log('✅ 已修復login($1)問題');
  } else {
    console.log('登入頁面沒有login($1)問題，檢查其他問題...');
    
    // 確保使用了正確的參數
    const handleSubmitRegex = /const\s+handleSubmit\s*=\s*async\s*\(\s*e\s*:\s*React\.FormEvent\s*\)\s*=>\s*{[\s\S]*?try\s*{[\s\S]*?const\s+loginResult\s*=\s*await\s+login\s*\(\s*([^,)]*)(,\s*([^)]*))?\s*\)/;
    const match = content.match(handleSubmitRegex);
    
    if (match) {
      const firstArg = match[1];
      const secondArg = match[3];
      
      if (!secondArg) {
        console.log(`發現login只有一個參數：${firstArg}`);
        
        // 替換整個login調用
        const newContent = content.replace(
          /const\s+loginResult\s*=\s*await\s+login\s*\(\s*([^,)]*)\s*\)/,
          'const loginResult = await login(email, password)'
        );
        
        fs.writeFileSync(loginPagePath, newContent, 'utf8');
        console.log('✅ 已修復login缺少參數問題');
      } else {
        console.log(`登入頁面的login調用正確：login(${firstArg}, ${secondArg})`);
      }
    } else {
      console.log('無法識別handleSubmit函數中的login調用');
      
      // 直接提供完全正確的內容
      console.log('重寫完整的登入頁面...');
      
      const correctContent = `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    console.log('嘗試登入:', email);
    
    try {
      // 確保正確傳遞email和password兩個參數
      const loginResult = await login(email, password);
      console.log('登入結果:', loginResult);
      
      if (loginResult) {
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
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500"
              >
                {isLoading ? '處理中...' : '登入'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}`;
      
      fs.writeFileSync(loginPagePath, correctContent, 'utf8');
      console.log('✅ 已完全重寫登入頁面');
    }
  }
  
  // 檢查最終結果
  const finalContent = fs.readFileSync(loginPagePath, 'utf8');
  const containsError = finalContent.includes('login($1)');
  const containsCorrect = finalContent.includes('login(email, password)');
  
  console.log(`最終檢查：包含錯誤：${containsError}, 包含正確調用：${containsCorrect}`);
  
  if (containsError) {
    console.error('❌ 修復失敗，文件仍然包含login($1)');
  } else if (containsCorrect) {
    console.log('✅ 修復成功，文件現在包含正確的login(email, password)');
  } else {
    console.warn('⚠️ 未找到任何login調用，請檢查文件是否正確');
  }
} else {
  console.error(`❌ 找不到登入頁面文件：${loginPagePath}`);
}

console.log('login($1)問題修復完成'); 