/**
 * 緊急修復register頁面的語法問題
 * 不進行任何檢查，直接替換整個文件
 */

const fs = require('fs');
const path = require('path');

console.log('============================');
console.log('緊急修復註冊頁面語法問題...');
console.log('============================');

// 目標註冊頁面路徑
const registerPagePath = path.join(process.cwd(), 'app/auth/register/page.tsx');
console.log(`目標註冊頁面路徑: ${registerPagePath}`);

// 確保目錄存在
const registerDir = path.dirname(registerPagePath);
if (!fs.existsSync(registerDir)) {
  console.log(`創建目錄: ${registerDir}`);
  fs.mkdirSync(registerDir, { recursive: true });
}

// 如果文件存在，先刪除
if (fs.existsSync(registerPagePath)) {
  console.log(`刪除現有頁面: ${registerPagePath}`);
  fs.unlinkSync(registerPagePath);
}

// 準備完全正確的註冊頁面內容
const correctRegisterPageContent = "'use client';\n\nimport { useState, FormEvent } from 'react';\nimport { useRouter } from 'next/navigation';\nimport Link from 'next/link';\nimport { useAuth } from '@/app/contexts/AuthContext';\n\nexport default function RegisterPage() {\n  const router = useRouter();\n  const { register, isLoading } = useAuth();\n  \n  const [formData, setFormData] = useState({\n    firstName: '',\n    lastName: '',\n    email: '',\n    password: '',\n    confirmPassword: ''\n  });\n  \n  const [error, setError] = useState('');\n  \n  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n    const { name, value } = e.target;\n    setFormData({\n      ...formData,\n      [name]: value\n    });\n  };\n  \n  const handleSubmit = async (e: FormEvent) => {\n    e.preventDefault();\n    \n    // 清除先前的錯誤\n    setError('');\n    \n    // 驗證確認密碼是否匹配\n    if (formData.password !== formData.confirmPassword) {\n      setError('密碼與確認密碼不符');\n      return;\n    }\n    \n    try {\n      // 調用註冊功能\n      const result = await register({\n        firstName: formData.firstName,\n        lastName: formData.lastName,\n        email: formData.email,\n        password: formData.password\n      });\n      \n      if (result && result.success) {\n        // 註冊成功，導航到會員區\n        router.push('/member');\n      } else {\n        // 註冊失敗，顯示錯誤消息\n        setError(result?.message || '註冊失敗，請稍後再試');\n      }\n    } catch (error) {\n      setError('發生錯誤，請稍後再試');\n      console.error('註冊錯誤:', error);\n    }\n  };\n  \n  return (\n    <div className=\"min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8\">\n      <div className=\"sm:mx-auto sm:w-full sm:max-w-md\">\n        <h2 className=\"mt-6 text-center text-3xl font-extrabold text-gray-900\">\n          創建您的帳戶\n        </h2>\n        <p className=\"mt-2 text-center text-sm text-gray-600\">\n          已有帳戶？{' '}\n          <Link href=\"/auth/login\" className=\"font-medium text-ya-yellow-600 hover:text-ya-yellow-500\">\n            立即登入\n          </Link>\n        </p>\n      </div>\n\n      <div className=\"mt-8 sm:mx-auto sm:w-full sm:max-w-md\">\n        <div className=\"bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10\">\n          {error && (\n            <div className=\"mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded\">\n              {error}\n            </div>\n          )}\n          \n          <form className=\"space-y-6\" onSubmit={handleSubmit}>\n            <div>\n              <label htmlFor=\"firstName\" className=\"block text-sm font-medium text-gray-700\">\n                名字\n              </label>\n              <div className=\"mt-1\">\n                <input\n                  id=\"firstName\"\n                  name=\"firstName\"\n                  type=\"text\"\n                  autoComplete=\"given-name\"\n                  required\n                  value={formData.firstName}\n                  onChange={handleChange}\n                  className=\"appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm\"\n                />\n              </div>\n            </div>\n\n            <div>\n              <label htmlFor=\"lastName\" className=\"block text-sm font-medium text-gray-700\">\n                姓氏\n              </label>\n              <div className=\"mt-1\">\n                <input\n                  id=\"lastName\"\n                  name=\"lastName\"\n                  type=\"text\"\n                  autoComplete=\"family-name\"\n                  required\n                  value={formData.lastName}\n                  onChange={handleChange}\n                  className=\"appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm\"\n                />\n              </div>\n            </div>\n\n            <div>\n              <label htmlFor=\"email\" className=\"block text-sm font-medium text-gray-700\">\n                電子郵件地址\n              </label>\n              <div className=\"mt-1\">\n                <input\n                  id=\"email\"\n                  name=\"email\"\n                  type=\"email\"\n                  autoComplete=\"email\"\n                  required\n                  value={formData.email}\n                  onChange={handleChange}\n                  className=\"appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm\"\n                />\n              </div>\n            </div>\n\n            <div>\n              <label htmlFor=\"password\" className=\"block text-sm font-medium text-gray-700\">\n                密碼\n              </label>\n              <div className=\"mt-1\">\n                <input\n                  id=\"password\"\n                  name=\"password\"\n                  type=\"password\"\n                  autoComplete=\"new-password\"\n                  required\n                  value={formData.password}\n                  onChange={handleChange}\n                  minLength={6}\n                  className=\"appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm\"\n                />\n              </div>\n            </div>\n\n            <div>\n              <label htmlFor=\"confirmPassword\" className=\"block text-sm font-medium text-gray-700\">\n                確認密碼\n              </label>\n              <div className=\"mt-1\">\n                <input\n                  id=\"confirmPassword\"\n                  name=\"confirmPassword\"\n                  type=\"password\"\n                  autoComplete=\"new-password\"\n                  required\n                  value={formData.confirmPassword}\n                  onChange={handleChange}\n                  className=\"appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm\"\n                />\n              </div>\n            </div>\n\n            <div>\n              <button\n                type=\"submit\"\n                disabled={isLoading}\n                className=\"w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500\"\n              >\n                {isLoading ? '處理中...' : '註冊'}\n              </button>\n            </div>\n          </form>\n        </div>\n      </div>\n    </div>\n  );\n}";

// 直接寫入文件，確保無錯誤
console.log('寫入正確的註冊頁面...');
fs.writeFileSync(registerPagePath, correctRegisterPageContent, 'utf8');

// 確認文件寫入成功
if (fs.existsSync(registerPagePath)) {
  const fileSize = fs.statSync(registerPagePath).size;
  console.log(`確認文件寫入成功，大小: ${fileSize} 字節`);
  
  // 打印寫入的文件的前100個字符，確認無錯誤
  const contentCheck = fs.readFileSync(registerPagePath, 'utf8').substring(0, 100);
  console.log(`文件內容檢查: ${contentCheck}`);
} else {
  console.error('錯誤：文件寫入失敗！');
}

console.log('============================');
console.log('緊急修復完成');
console.log('==========================='); 