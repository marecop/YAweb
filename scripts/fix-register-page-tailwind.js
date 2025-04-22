/**
 * 修復register頁面的Tailwind CSS語法問題
 */

const fs = require('fs');
const path = require('path');

console.log('============================');
console.log('修復註冊頁面Tailwind CSS語法...');
console.log('============================');

// 強制完全覆蓋register頁面，確保沒有語法錯誤
const registerPagePath = path.join(process.cwd(), 'app/auth/register/page.tsx');
console.log(`註冊頁面路徑: ${registerPagePath}`);

// 確保目錄存在
const registerDir = path.dirname(registerPagePath);
if (!fs.existsSync(registerDir)) {
  console.log(`創建目錄: ${registerDir}`);
  fs.mkdirSync(registerDir, { recursive: true });
}

// 直接寫入正確的註冊頁面內容，完全覆蓋而不是嘗試修復
console.log('寫入正確的註冊頁面代碼...');

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
      // 調用註冊功能
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      
      if (result && result.success) {
        // 註冊成功，導航到會員區
        router.push('/member');
      } else {
        // 註冊失敗，顯示錯誤消息
        setError(result?.message || '註冊失敗，請稍後再試');
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

// 強制覆蓋現有文件
try {
  fs.writeFileSync(registerPagePath, correctRegisterPageContent, 'utf8');
  console.log(`成功寫入正確的註冊頁面，檔案大小: ${fs.statSync(registerPagePath).size} 字節`);

  // 檢查文件是否寫入成功
  const content = fs.readFileSync(registerPagePath, 'utf8');
  if (content.includes("className={styles.")) {
    console.error('警告：寫入後檔案仍含有錯誤的 className 格式！');
    
    // 再次嘗試修復錯誤的格式
    let fixedContent = content;
    fixedContent = fixedContent.replace(/className=\{styles\.([^}"]+)"\}/g, 'className="$1"');
    fixedContent = fixedContent.replace(/className=\{styles\.([^}]+)\}/g, 'className="$1"');
    
    // 再次寫入修復後的內容
    fs.writeFileSync(registerPagePath, fixedContent, 'utf8');
    console.log('已再次修復並保存文件');
  } else {
    console.log('檔案內容檢查正常，沒有發現錯誤的 className 格式');
  }
} catch (error) {
  console.error(`寫入檔案時出錯: ${error.message}`);
}

// 檢查是否有可能在其他位置的錯誤頁面
const otherPossiblePaths = [
  path.join(process.cwd(), 'app', 'register', 'page.tsx'),
  path.join(process.cwd(), 'pages', 'auth', 'register.tsx'),
  path.join(process.cwd(), 'pages', 'register.tsx')
];

otherPossiblePaths.forEach(possiblePath => {
  if (fs.existsSync(possiblePath)) {
    console.log(`發現可能的其他註冊頁面: ${possiblePath}，覆蓋內容...`);
    try {
      fs.writeFileSync(possiblePath, correctRegisterPageContent, 'utf8');
    } catch (error) {
      console.error(`寫入 ${possiblePath} 時出錯: ${error.message}`);
    }
  }
});

console.log('============================');
console.log('註冊頁面Tailwind CSS語法修復完成');
console.log('==========================='); 