'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { FaUser, FaPlane, FaTicketAlt, FaCreditCard, FaExchangeAlt, FaCog, FaLock } from 'react-icons/fa';
import { getMemberLevelName, getMemberLevelColorClass } from '@/app/utils/memberUtils';

// 定義活動記錄類型
interface Activity {
  id: string;
  type: string;
  date: string;
  description: string;
  details: string;
  milesEarned?: number;
  milesUsed?: number;
}

export default function MemberPage() {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useAuth();
  const [milesInfo, setMilesInfo] = useState({
    total: 0,
    balance: 0,
    expiring: 0,
    level: 'Standard'
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loadingMiles, setLoadingMiles] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  
  // 從本地存儲載入示例數據
  const loadMemberData = async () => {
    setLoadingMiles(true);
    setLoadingActivities(true);
    try {
      // 模擬從API獲取數據
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 示例里程數據
      setMilesInfo({
        total: user?.id ? parseInt(user.id) * 100 : 0,
        balance: 35680,
        expiring: 5000,
        level: user?.id ? (parseInt(user.id) % 3 === 0 ? 'Gold' : parseInt(user.id) % 2 === 0 ? 'Silver' : 'Standard') : 'Standard'
      });
      
      // 示例活動數據
      setRecentActivities([
        {
          id: 'act-001',
          type: 'flight',
          date: '2023-10-15',
          description: '台北 (TPE) → 東京 (HND)',
          details: 'YA203',
          milesEarned: 1500
        },
        {
          id: 'act-002',
          type: 'flight',
          date: '2023-10-22',
          description: '東京 (HND) → 台北 (TPE)',
          details: 'YA204',
          milesEarned: 1500
        },
        {
          id: 'act-003',
          type: 'redemption',
          date: '2023-11-05',
          description: '兌換免費機票',
          details: 'TPE-HKG',
          milesUsed: 15000
        }
      ]);
    } catch (error) {
      console.error('加載會員數據時出錯:', error);
    } finally {
      setLoadingMiles(false);
      setLoadingActivities(false);
    }
  };
  
  useEffect(() => {
    // 確保用戶已登入，否則導向登入頁面
    if (!loading && !isLoggedIn) {
      router.push('/login');
      return;
    }
    
    // 加載會員里程數據
    if (isLoggedIn && user) {
      loadMemberData();
    }
  }, [loading, isLoggedIn, user, router]);
  
  // 從本地存儲載入示例數據
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 僅當認證完成時才繼續
    if (loading) return;
    
    // 如果未登錄，重定向到登錄頁面
    if (!loading && !isLoggedIn) {
      router.push('/login');
      return;
    }
  }, [loading, isLoggedIn, router]);
  
  // 獲取用戶頭像的首字母
  const getUserInitials = () => {
    if (!user) return 'U';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    } else if (user.firstName) {
      return user.firstName[0].toUpperCase();
    } else if (user.lastName) {
      return user.lastName[0].toUpperCase();
    } else if (user.email) {
      return user.email[0].toUpperCase();
    } else {
      return 'U';
    }
  };
  
  // 根據會員等級獲取顏色
  const getLevelColor = () => {
    if (!user?.memberLevel) return 'bg-blue-100 text-blue-800';
    return getMemberLevelColorClass(user.memberLevel);
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
          <p className="text-gray-600 mb-8">您需要登入才能訪問會員中心。</p>
          <button
            onClick={() => router.push('/login')}
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
      {/* 會員資訊區域 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-8 sm:p-10 bg-gradient-to-r from-ya-yellow-500 to-ya-yellow-600">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-ya-yellow-600 text-3xl font-bold shadow-md">
                {getUserInitials()}
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-white mb-1">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-ya-yellow-50 mb-3">{user?.email}</p>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor()}`}>
                  {getMemberLevelName(user?.memberLevel || 'standard')}
                </span>
                <span className="text-white">
                  會員ID: YA{user?.id?.substring(5, 12) || ''}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 里程餘額顯示 */}
        <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold text-gray-800">我的里程</h2>
              <div className="mt-1 flex items-center">
                <span className="text-3xl font-bold text-ya-yellow-600">{milesInfo.balance.toLocaleString()}</span>
                <span className="ml-2 text-sm text-gray-500">可用里程</span>
              </div>
              {milesInfo.expiring > 0 && (
                <p className="text-sm text-red-600 mt-2">
                  * {milesInfo.expiring.toLocaleString()} 里程將在 60 天內到期
                </p>
              )}
            </div>
            <div>
              <Link href="/member/miles" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ya-yellow-600 hover:bg-ya-yellow-700">
                檢視里程詳情
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* 主要內容區域 - 網格佈局 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 左側 - 功能導航 */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">會員功能</h2>
            </div>
            <div className="divide-y divide-gray-200">
              <Link href="/member" className="block px-4 py-4 hover:bg-ya-yellow-50 transition-colors">
                <div className="flex items-center">
                  <FaUser className="text-ya-yellow-500 mr-3" />
                  <span className="text-gray-700 font-medium">會員總覽</span>
                </div>
              </Link>
              <Link href="/member/miles" className="block px-4 py-4 hover:bg-ya-yellow-50 transition-colors">
                <div className="flex items-center">
                  <FaPlane className="text-ya-yellow-500 mr-3" />
                  <span className="text-gray-700 font-medium">我的里程</span>
                </div>
              </Link>
              <Link href="/bookings" className="block px-4 py-4 hover:bg-ya-yellow-50 transition-colors">
                <div className="flex items-center">
                  <FaTicketAlt className="text-ya-yellow-500 mr-3" />
                  <span className="text-gray-700 font-medium">我的預訂</span>
                </div>
              </Link>
              <Link href="/member/redemption" className="block px-4 py-4 hover:bg-ya-yellow-50 transition-colors">
                <div className="flex items-center">
                  <FaExchangeAlt className="text-ya-yellow-500 mr-3" />
                  <span className="text-gray-700 font-medium">兌換中心</span>
                </div>
              </Link>
              <Link href="/member/settings" className="block px-4 py-4 hover:bg-ya-yellow-50 transition-colors">
                <div className="flex items-center">
                  <FaCog className="text-ya-yellow-500 mr-3" />
                  <span className="text-gray-700 font-medium">帳戶設置</span>
                </div>
              </Link>
              <Link href="/member/password" className="block px-4 py-4 hover:bg-ya-yellow-50 transition-colors">
                <div className="flex items-center">
                  <FaLock className="text-ya-yellow-500 mr-3" />
                  <span className="text-gray-700 font-medium">修改密碼</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        {/* 右側 - 最近活動和里程摘要 */}
        <div className="md:col-span-2">
          {/* 最近活動 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">最近活動</h2>
              <Link href="/member/miles" className="text-sm text-ya-yellow-600 hover:text-ya-yellow-700">
                查看所有活動
              </Link>
            </div>
            
            {loadingActivities ? (
              <div className="px-4 py-8 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ya-yellow-500 mx-auto"></div>
                <p className="mt-3 text-gray-500">載入活動記錄中...</p>
              </div>
            ) : recentActivities.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <div className="mt-1 flex items-center">
                          <span className="text-sm text-gray-500 mr-4">
                            {activity.date}
                          </span>
                          <span className="text-sm text-gray-500">
                            {activity.details}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.milesEarned ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            +{activity.milesEarned} 里程
                          </span>
                        ) : activity.milesUsed ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            -{activity.milesUsed} 里程
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-gray-500">暫無活動記錄</p>
              </div>
            )}
          </div>
          
          {/* 會員權益 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">會員權益</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-ya-yellow-300 hover:shadow-md transition-all">
                  <h3 className="font-medium text-gray-900 mb-2">優先登機</h3>
                  {milesInfo.level === 'Standard' ? (
                    <p className="text-sm text-gray-500">升級至 Silver 或 Gold 會員即可享有</p>
                  ) : (
                    <p className="text-sm text-green-600">✓ 您已可享有此權益</p>
                  )}
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 hover:border-ya-yellow-300 hover:shadow-md transition-all">
                  <h3 className="font-medium text-gray-900 mb-2">貴賓休息室</h3>
                  {milesInfo.level === 'Gold' ? (
                    <p className="text-sm text-green-600">✓ 您已可享有此權益</p>
                  ) : (
                    <p className="text-sm text-gray-500">升級至 Gold 會員即可享有</p>
                  )}
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 hover:border-ya-yellow-300 hover:shadow-md transition-all">
                  <h3 className="font-medium text-gray-900 mb-2">額外行李額度</h3>
                  {milesInfo.level === 'Standard' ? (
                    <p className="text-sm text-gray-500">升級至 Silver 或 Gold 會員可增加行李額度</p>
                  ) : milesInfo.level === 'Silver' ? (
                    <p className="text-sm text-green-600">✓ 額外 10 公斤</p>
                  ) : (
                    <p className="text-sm text-green-600">✓ 額外 20 公斤</p>
                  )}
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 hover:border-ya-yellow-300 hover:shadow-md transition-all">
                  <h3 className="font-medium text-gray-900 mb-2">里程效率</h3>
                  {milesInfo.level === 'Standard' ? (
                    <p className="text-sm text-green-600">✓ 基本里程</p>
                  ) : milesInfo.level === 'Silver' ? (
                    <p className="text-sm text-green-600">✓ 里程 x 1.25</p>
                  ) : (
                    <p className="text-sm text-green-600">✓ 里程 x 1.5</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Link href="/member/benefits" className="text-ya-yellow-600 hover:text-ya-yellow-700 font-medium">
                  查看所有會員權益 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 