'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaAngleRight, FaAngleLeft, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { getMemberLevelName, getMemberLevelColorClass } from '@/app/utils/memberUtils';

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
};

// 根據會員等級獲取顏色（里程卡片的漸變背景）
const getLevelGradientColor = (level: string) => {
  switch (level) {
    case '銀卡會員':
      return 'bg-gradient-to-r from-gray-300 to-gray-400';
    case '金卡會員':
      return 'bg-gradient-to-r from-yellow-300 to-yellow-400';
    case '鑽石卡會員':
      return 'bg-gradient-to-r from-blue-300 to-blue-400';
    default:
      return 'bg-gradient-to-r from-gray-100 to-gray-200';
  }
};

// 里程記錄介面
interface MileageRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'earned' | 'used';
  flightNumber?: string;
  redeemItem?: string;
}

// 里程信息介面
interface MileageInfo {
  totalMiles: number;
  availableMiles: number;
  level: string;
  nextLevel: string;
  milesForNextLevel: number;
  expireDate: string;
}

export default function MilesPage() {
  const {isLoggedIn, loading, user} = useAuth();
  const router = useRouter();
  
  // 狀態管理
  const [milesHistory, setMilesHistory] = useState<MileageRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'earned' | 'used'>('all');
  const [milesInfo, setMilesInfo] = useState<MileageInfo>({
    totalMiles: 0,
    availableMiles: 0,
    level: '普通會員',
    nextLevel: '銀卡會員',
    milesForNextLevel: 25000,
    expireDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  });

  // 獲取里程數據
  useEffect(() => {
    // 等待身份驗證完成
    if (loading) return;
    
    // 如果未登入，導向登入頁面
    if (!isLoggedIn) {
      router.push('/login?redirect=/member/miles');
      return;
    }
    
    // 從API獲取里程數據
    const fetchMileageData = async () => {
      try {
        setHistoryLoading(true);
        const response = await fetch('/api/miles', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error('獲取里程數據失敗');
        }
        
        const data = await response.json();
        setMilesInfo(data.info);
        setMilesHistory(data.history);
      } catch (error) {
        console.error('獲取里程數據時出錯:', error);
      } finally {
        setHistoryLoading(false);
      }
    };
    
    fetchMileageData();
  }, [isLoggedIn, loading, router]);

  // 根據活動標籤過濾記錄
  const filteredHistory = milesHistory.filter(record => {
    if (activeTab === 'all') return true;
    return record.status === activeTab;
  });

  // 進度計算
  const progressPercent = milesInfo.nextLevel === '最高等級' 
    ? 100 
    : Math.min(100, ((milesInfo.totalMiles % 25000) / 25000) * 100);

  // 如果身份驗證正在加載中
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  // 如果未登入
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">請先登入</h1>
        <p className="mb-6 text-gray-600">您需要登入才能查看里程信息</p>
        <Link 
          href="/login?redirect=/member/miles" 
          className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
        >
          前往登入
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* 麵包屑導航 */}
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-yellow-500">首頁</Link>
          <span className="mx-2">/</span>
          <Link href="/member" className="hover:text-yellow-500">會員中心</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">我的里程</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">我的里程</h1>
        
        {historyLoading ? (
          <div className="flex items-center justify-center h-64">
            <FaSpinner className="w-8 h-8 text-yellow-500 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* 里程摘要卡 */}
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className={`p-6 text-white ${getLevelGradientColor(milesInfo.level)}`}>
                  <h2 className="text-lg font-semibold">可用里程數</h2>
                  <p className="text-3xl font-bold mt-2">{milesInfo.availableMiles.toLocaleString()}</p>
                  <p className="mt-1">總里程: {milesInfo.totalMiles.toLocaleString()}</p>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{milesInfo.level}</span>
                    <span className="text-sm text-gray-500">{milesInfo.nextLevel !== '最高等級' ? milesInfo.nextLevel : ''}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  
                  {milesInfo.nextLevel !== '最高等級' && (
                    <p className="text-sm text-gray-500 mt-2">
                      還需 {milesInfo.milesForNextLevel.toLocaleString()} 里程升級為 {milesInfo.nextLevel}
                    </p>
                  )}
                  
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500">有效期至: {formatDate(milesInfo.expireDate)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 里程歷史記錄 */}
            <div className="md:w-2/3 bg-white rounded-lg shadow-md">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-semibold">里程歷史記錄</h2>
                <div>
                  <Link href="/member/flights" className="text-yellow-600 hover:text-yellow-700 text-sm flex items-center">
                    查看航班記錄
                    <FaAngleRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              {/* 標籤切換 */}
              <div className="px-6 pb-2 flex border-b">
                <button 
                  onClick={() => setActiveTab('all')} 
                  className={`pb-2 px-4 font-medium ${activeTab === 'all' ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  全部
                </button>
                <button 
                  onClick={() => setActiveTab('earned')} 
                  className={`pb-2 px-4 font-medium ${activeTab === 'earned' ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  獲得
                </button>
                <button 
                  onClick={() => setActiveTab('used')} 
                  className={`pb-2 px-4 font-medium ${activeTab === 'used' ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  使用
                </button>
              </div>
            </div>
            
            {/* 歷史記錄表格 */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">里程數</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(item.date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.description}
                          {item.flightNumber && <span className="text-gray-500 ml-2">({item.flightNumber})</span>}
                          {item.redeemItem && <span className="text-gray-500 ml-2">({item.redeemItem})</span>}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${item.status === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                          {item.status === 'earned' ? '+' : '-'}{Math.abs(item.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === 'earned' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status === 'earned' ? '已獲得' : '已使用'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        沒有符合條件的里程記錄
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 