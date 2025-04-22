'use client'

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { FaChevronLeft, FaSave, FaUser } from 'react-icons/fa';

export default function SettingsPage() {
  const router = useRouter();
  const { isLoggedIn, user, loading } = useAuth();
  const [formLoading, setFormLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  
  // 用戶資料表單
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    language: 'zh-TW',
    currency: 'TWD',
    newsletterSubscribed: true,
    seatPreference: 'window',
    mealPreference: 'regular'
  });
  
  // 從認證上下文加載用戶數據
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 僅當認證完成時才繼續
    if (loading) return;
    
    // 如果未登錄，重定向到登錄頁面
    if (!loading && !isLoggedIn) {
      router.push('/auth/login?redirect=/member/settings');
      return;
    }
    
    // 填充表單數據
    if (user) {
      setUserData(prevData => ({
        ...prevData,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      }));
    }
  }, [loading, isLoggedIn, user, router]);
  
  // 處理表單變化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };
  
  // 處理複選框變化
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setUserData(prev => ({ ...prev, [name]: checked }));
  };
  
  // 提交表單
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setSaveSuccess(false);
    
    try {
      // 模擬API請求
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 顯示成功訊息
      setSaveSuccess(true);
      
      // 3秒後隱藏成功訊息
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('保存設置時出錯:', error);
      setFormError('保存設置時發生錯誤，請稍後再試');
    } finally {
      setFormLoading(false);
    }
  };
  
  // 如果認證正在加載，顯示加載中
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ya-yellow-500"></div>
        <span className="ml-3 text-lg text-gray-700">驗證身份中...</span>
      </div>
    );
  }
  
  // 如果未登入，顯示登入提示（通常不會到這裡，因為會被重定向）
  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">請先登入</h2>
          <p className="text-gray-600 mb-8">您需要登入才能訪問帳戶設置。</p>
          <button
            onClick={() => router.push('/auth/login?redirect=/member/settings')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500"
          >
            前往登入
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 返回會員中心 */}
      <div className="mb-6">
        <Link href="/member" className="inline-flex items-center text-gray-600 hover:text-ya-yellow-600">
          <FaChevronLeft className="mr-1" /> 返回會員中心
        </Link>
      </div>
      
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">帳戶設置</h1>
        <p className="mt-2 text-lg text-gray-600">
          更新您的個人資料和偏好設置
        </p>
      </div>
      
      {/* 成功提示 */}
      {saveSuccess && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                您的設置已成功保存！
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* 錯誤提示 */}
      {formError && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {formError}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* 設置表單 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit}>
          {/* 個人資料區塊 */}
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">個人資料</h2>
            <p className="mt-1 text-sm text-gray-600">更新您的個人基本資料</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">名字</label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={userData.firstName}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-ya-yellow-500 focus:border-ya-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">姓氏</label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={userData.lastName}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-ya-yellow-500 focus:border-ya-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">電子郵件</label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={userData.email}
                    disabled
                    className="bg-gray-100 shadow-sm focus:ring-ya-yellow-500 focus:border-ya-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <p className="mt-1 text-xs text-gray-500">電子郵件地址無法變更，如需修改請聯繫客服</p>
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">電話號碼</label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-ya-yellow-500 focus:border-ya-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">地址</label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={userData.address}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-ya-yellow-500 focus:border-ya-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">城市</label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={userData.city}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-ya-yellow-500 focus:border-ya-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">國家或地區</label>
                <div className="mt-1">
                  <select
                    name="country"
                    id="country"
                    value={userData.country}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-ya-yellow-500 focus:border-ya-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">請選擇國家或地區</option>
                    <option value="TW">台灣</option>
                    <option value="JP">日本</option>
                    <option value="HK">香港</option>
                    <option value="SG">新加坡</option>
                    <option value="US">美國</option>
                    <option value="CN">中國</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">郵遞區號</label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="postalCode"
                    id="postalCode"
                    value={userData.postalCode}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-ya-yellow-500 focus:border-ya-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* 偏好設置區塊 */}
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">偏好設置</h2>
            <p className="mt-1 text-sm text-gray-600">設置您的旅行偏好和通知方式</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">語言</label>
                <div className="mt-1">
                  <select
                    name="language"
                    id="language"
                    value={userData.language}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-ya-yellow-500 focus:border-ya-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="zh-TW">繁體中文</option>
                    <option value="en-US">English</option>
                    <option value="ja-JP">日本語</option>
                    <option value="ko-KR">한국어</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">貨幣</label>
                <div className="mt-1">
                  <select
                    name="currency"
                    id="currency"
                    value={userData.currency}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-ya-yellow-500 focus:border-ya-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="USD">美元 (USD)</option>
                    <option value="JPY">日元 (JPY)</option>
                    <option value="HKD">港幣 (HKD)</option>
                    <option value="CNY">人民幣 (CNY)</option>
                    <option value="SGD">新加坡幣 (SGD)</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="seatPreference" className="block text-sm font-medium text-gray-700">座位偏好</label>
                <div className="mt-1">
                  <select
                    name="seatPreference"
                    id="seatPreference"
                    value={userData.seatPreference}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-ya-yellow-500 focus:border-ya-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="window">靠窗</option>
                    <option value="aisle">靠走道</option>
                    <option value="middle">中間</option>
                    <option value="front">前排</option>
                    <option value="exit">緊急出口</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="mealPreference" className="block text-sm font-medium text-gray-700">餐食偏好</label>
                <div className="mt-1">
                  <select
                    name="mealPreference"
                    id="mealPreference"
                    value={userData.mealPreference}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-ya-yellow-500 focus:border-ya-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="regular">標準餐</option>
                    <option value="vegetarian">素食餐</option>
                    <option value="halal">清真餐</option>
                    <option value="diabetic">糖尿病餐</option>
                    <option value="lactose-free">無乳糖餐</option>
                    <option value="gluten-free">無麩質餐</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="newsletterSubscribed"
                      name="newsletterSubscribed"
                      type="checkbox"
                      checked={userData.newsletterSubscribed}
                      onChange={handleCheckboxChange}
                      className="focus:ring-ya-yellow-500 h-4 w-4 text-ya-yellow-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="newsletterSubscribed" className="font-medium text-gray-700">訂閱電子報</label>
                    <p className="text-gray-500">接收最新優惠、航線和活動資訊</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 提交按鈕 */}
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              disabled={formLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500"
            >
              {formLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  儲存中...
                </>
              ) : (
                <>
                  <FaSave className="mr-2 -ml-1 h-4 w-4" />
                  儲存設置
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 