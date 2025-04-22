/**
 * 此腳本用於修復AuthContext中的register函數簽名問題
 */

const fs = require('fs');
const path = require('path');

console.log('開始修復AuthContext中的register函數簽名...');

const authContextPath = path.join(process.cwd(), 'app/contexts/AuthContext.tsx');

if (fs.existsSync(authContextPath)) {
  console.log(`找到AuthContext文件：${authContextPath}`);
  
  // 讀取文件內容
  let content = fs.readFileSync(authContextPath, 'utf8');
  
  // 1. 檢查並修復AuthContextType接口中的register函數定義
  const authContextTypePattern = /export\s+interface\s+AuthContextType\s*{[\s\S]*?register[\s\S]*?;[\s\S]*?}/;
  if (authContextTypePattern.test(content)) {
    console.log('找到AuthContextType接口，修復register函數簽名...');
    
    // 替換register函數簽名，確保使用四個獨立參數而不是對象參數
    content = content.replace(
      /register\s*:\s*\([^)]*\)\s*=>\s*Promise<[^>]*>/,
      'register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>'
    );
    
    console.log('✅ 已修復AuthContextType接口中的register函數簽名');
  }
  
  // 2. 檢查並修復handleRegister函數實現
  const handleRegisterPattern = /const\s+handleRegister\s*=\s*async\s*\([^)]*\)\s*:\s*Promise<[^>]*>/;
  if (handleRegisterPattern.test(content)) {
    console.log('找到handleRegister函數實現，檢查是否需要修復...');
    
    // 修改函數簽名為四個獨立參數
    content = content.replace(
      handleRegisterPattern,
      'const handleRegister = async (firstName: string, lastName: string, email: string, password: string): Promise<any>'
    );
    console.log('✅ 已修復handleRegister函數實現');
    
    // 修改函數內部的邏輯以適配四個獨立參數
    const handleRegisterBodyPattern = /const\s+handleRegister\s*=\s*async\s*\([^)]*\)[^{]*{([\s\S]*?)try\s*{([\s\S]*?)const\s+result\s*=\s*await\s+register\s*\([^)]*\)/;
    if (handleRegisterBodyPattern.test(content)) {
      console.log('修改函數內部邏輯以支持四個獨立參數...');
      
      // 替換register調用方式
      content = content.replace(
        /const\s+result\s*=\s*await\s+register\s*\([^)]*\)/,
        'const result = await register(firstName, lastName, email, password)'
      );
      
      console.log('✅ 已修改函數內部邏輯');
    }
  }
  
  // 寫入修改後的內容
  fs.writeFileSync(authContextPath, content, 'utf8');
  console.log(`✅ AuthContext.tsx文件已成功修復並保存`);
  
  // 修復註冊頁面以適應新的函數簽名
  const registerPagePath = path.join(process.cwd(), 'app/auth/register/page.tsx');
  if (fs.existsSync(registerPagePath)) {
    console.log(`找到註冊頁面：${registerPagePath}`);
    
    // 不要嘗試部分修改，直接用正確的內容替換整個文件
    const correctRegisterPageContent = `'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // 清除先前的錯誤
    setError('');
    
    // 驗證確認密碼是否匹配
    if (formData.password !== formData.confirmPassword) {
      setError('密碼與確認密碼不符');
      return;
    }
    
    try {
      // 調用註冊功能 - 使用四個獨立參數
      const registrationSuccess = await register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      );
      
      if (registrationSuccess) {
        // 註冊成功，導航到會員區
        router.push('/member');
      } else {
        // 註冊失敗，顯示錯誤消息
        setError('註冊失敗，請稍後再試');
      }
    } catch (error) {
      setError('發生錯誤，請稍後再試');
      console.error('註冊錯誤:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          創建您的帳戶
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          已有帳戶？{' '}
          <Link href="/auth/login" className="font-medium text-ya-yellow-600 hover:text-ya-yellow-500">
            立即登入
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                名字
              </label>
              <div className="mt-1">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                姓氏
              </label>
              <div className="mt-1">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm"
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                確認密碼
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500"
              >
                {isLoading ? '處理中...' : '註冊'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}`;
    
    // 寫入更新的文件內容
    fs.writeFileSync(registerPagePath, correctRegisterPageContent, 'utf8');
    console.log('✅ 已重寫註冊頁面，使用四個獨立參數調用方式');
  }
  
  // 修改lib/auth.ts中的register函數
  const authLibPath = path.join(process.cwd(), 'app/lib/auth.ts');
  if (fs.existsSync(authLibPath)) {
    console.log(`找到auth.ts文件：${authLibPath}`);
    
    let authLibContent = fs.readFileSync(authLibPath, 'utf8');
    
    // 修改register函數以接受四個獨立參數而非RegisterParams對象
    const registerFunctionPattern = /export\s+async\s+function\s+register\s*\(\s*params\s*:\s*RegisterParams\s*\)\s*:\s*Promise<AuthResponse>/;
    if (registerFunctionPattern.test(authLibContent)) {
      console.log('修改register函數簽名...');
      
      // 替換函數簽名
      authLibContent = authLibContent.replace(
        registerFunctionPattern,
        'export async function register(firstName: string, lastName: string, email: string, password: string): Promise<AuthResponse>'
      );
      
      // 替換函數內部使用params的地方
      authLibContent = authLibContent.replace(
        /const\s+{\s*email\s*,\s*password\s*,\s*firstName\s*,\s*lastName\s*}\s*=\s*params\s*;/,
        '// 直接使用函數參數'
      );
      
      // 替換JSON.stringify(params)
      authLibContent = authLibContent.replace(
        /body\s*:\s*JSON\.stringify\s*\(\s*params\s*\)/,
        'body: JSON.stringify({ email, password, firstName, lastName })'
      );
      
      fs.writeFileSync(authLibPath, authLibContent, 'utf8');
      console.log('✅ 已修改auth.ts中的register函數');
    }
  }
} else {
  console.error(`❌ 找不到AuthContext文件：${authContextPath}`);
}

console.log('AuthContext修復完成'); 