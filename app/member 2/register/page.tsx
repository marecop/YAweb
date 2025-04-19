'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RegisterParams } from '@/app/lib/auth';
import { useAuth } from '@/app/contexts/AuthContext';

export default function MemberRegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterParams>({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    general?: string;
  }>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    // 驗證名字
    if (!formData.firstName.trim()) {
      newErrors.firstName = '請輸入名字';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = '請輸入姓氏';
    }
    
    // 驗證郵箱
    if (!formData.email) {
      newErrors.email = '請輸入電子郵件地址';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '請輸入有效的電子郵件地址';
    }
    
    // 驗證密碼
    if (!formData.password) {
      newErrors.password = '請輸入密碼';
    } else if (formData.password.length < 6) {
      newErrors.password = '密碼至少需要6個字符';
    }
    
    // 確認密碼匹配
    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = '密碼不匹配';
    }
    
    // 驗證條款同意
    if (!agreeToTerms) {
      newErrors.general = '您必須同意條款和條件才能註冊';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else if (name === 'agreeToTerms') {
      setAgreeToTerms(checked);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      console.log('發送註冊請求:', formData);
      const result = await register(formData);
      
      if (result === true) {
        // 註冊成功後導航到會員中心
        router.push('/member');
      } else {
        // 註冊失敗，顯示錯誤
        setErrors({ general: '註冊失敗，請稍後再試' });
      }
    } catch (error: any) {
      console.error('註冊過程中發生錯誤:', error);
      setErrors({ general: '註冊過程中發生錯誤，請稍後再試' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          註冊會員帳戶
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          已經是會員？{' '}
          <Link href="/auth/login" className="font-medium text-ya-yellow-600 hover:text-ya-yellow-500">
            立即登入
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.general}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
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
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm`}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
                  )}
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
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm`}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                電子郵件
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
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
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
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">密碼至少需要 6 個字符</p>
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
                  value={confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm`}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-ya-yellow-600 focus:ring-ya-yellow-500 border-gray-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                我同意{' '}
                <button
                  type="button"
                  className="text-ya-yellow-600 hover:text-ya-yellow-500"
                  onClick={() => setShowTerms(true)}
                >
                  使用條款
                </button>{' '}
                和{' '}
                <button
                  type="button"
                  className="text-ya-yellow-600 hover:text-ya-yellow-500"
                  onClick={() => setShowPrivacy(true)}
                >
                  隱私政策
                </button>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    註冊中...
                  </span>
                ) : '註冊會員'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 使用條款模態框 */}
      {showTerms && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">使用條款</h3>
              <div className="prose prose-sm max-w-none">
                <p>歡迎使用黃色航空的服務！以下是我們的使用條款，請仔細閱讀。</p>
                <h4>1. 服務描述</h4>
                <p>黃色航空提供在線機票預訂、會員管理和里程累積等服務。</p>
                <h4>2. 會員資格</h4>
                <p>註冊成為會員即表示您同意以下條件：</p>
                <ul>
                  <li>您必須至少年滿18歲</li>
                  <li>您提供的所有個人資料均為真實準確</li>
                  <li>您將妥善保管自己的帳號密碼</li>
                </ul>
                <h4>3. 隱私保護</h4>
                <p>我們重視您的隱私，相關隱私保護措施請參見隱私政策。</p>
                <h4>4. 其他條款</h4>
                <p>黃色航空保留在任何時候修改這些條款的權利。</p>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-ya-yellow-600 text-base font-medium text-white hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500 sm:text-sm"
                  onClick={() => setShowTerms(false)}
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 隱私政策模態框 */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">隱私政策</h3>
              <div className="prose prose-sm max-w-none">
                <p>保護您的隱私對我們非常重要。以下是我們的隱私政策概述。</p>
                <h4>1. 資料收集</h4>
                <p>我們收集的個人資料包括但不限於：</p>
                <ul>
                  <li>姓名、電子郵件地址等基本資訊</li>
                  <li>付款資訊（僅用於處理交易）</li>
                  <li>旅行偏好及歷史</li>
                </ul>
                <h4>2. 資料使用</h4>
                <p>我們使用您的資料：</p>
                <ul>
                  <li>提供並改進我們的服務</li>
                  <li>處理預訂和支付</li>
                  <li>發送重要通知和更新</li>
                </ul>
                <h4>3. 資料保護</h4>
                <p>我們採取適當的技術和組織措施來保護您的個人資料。</p>
                <h4>4. 第三方共享</h4>
                <p>我們不會將您的資料出售給第三方。我們僅在必要時與航空合作夥伴共享資料以完成您的預訂。</p>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-ya-yellow-600 text-base font-medium text-white hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500 sm:text-sm"
                  onClick={() => setShowPrivacy(false)}
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 