/**
 * 此腳本用於特別修復Render部署中出現的register函數參數問題
 */

const fs = require('fs');
const path = require('path');

console.log('開始專門修復register函數參數問題...');

const registerPagePath = path.join(process.cwd(), 'app/auth/register/page.tsx');

if (fs.existsSync(registerPagePath)) {
  console.log(`找到註冊頁面文件：${registerPagePath}`);
  
  // 讀取文件內容
  let content = fs.readFileSync(registerPagePath, 'utf8');
  
  // 檢查並修改register函數調用
  // 關鍵是確保register函數使用單一物件參數而不是多個獨立參數
  if (content.includes('await register({')) {
    console.log('發現register函數使用物件形式參數，檢查參數是否正確...');
    
    const correctContent = `'use client';

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
      // 調用註冊功能
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      };
      
      // 保證使用單一物件作為參數
      const registrationSuccess = await register(registrationData);
      
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
    
    // 完全替換文件內容
    fs.writeFileSync(registerPagePath, correctContent, 'utf8');
    console.log('✅ 已重寫註冊頁面，確保register函數使用正確的參數形式');
  } else {
    console.log('沒有發現register({...})格式的調用，嘗試尋找其他問題...');
    
    // 完全重寫整個頁面來確保正確性
    const correctContent = `'use client';

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
      // 調用註冊功能
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      };
      
      // 保證使用單一物件作為參數
      const registrationSuccess = await register(registrationData);
      
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
    
    fs.writeFileSync(registerPagePath, correctContent, 'utf8');
    console.log('✅ 已完全重寫註冊頁面');
  }
  
  // 最後確認修改是否生效
  const finalContent = fs.readFileSync(registerPagePath, 'utf8');
  
  // 檢查是否包含改進的寫法
  const hasImprovedCall = finalContent.includes('const registrationData = {') && 
                          finalContent.includes('const registrationSuccess = await register(registrationData)');
  
  console.log(`最終檢查：是否使用改進的調用方式：${hasImprovedCall}`);
  
  if (hasImprovedCall) {
    console.log('✅ 註冊頁面已正確修復');
  } else {
    console.error('❌ 註冊頁面可能未正確修復，請檢查');
  }
} else {
  console.error(`❌ 找不到註冊頁面文件：${registerPagePath}`);
}

console.log('register函數參數問題修復完成'); 