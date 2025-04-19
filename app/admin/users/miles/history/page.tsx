'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdEdit, MdDelete, MdSearch, MdFilterList } from 'react-icons/md';
import AdminLayout from '@/app/admin/layout';

interface MileageRecord {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  amount: number;
  type: 'earned' | 'used';
  description: string;
  date: string;
  status: 'pending' | 'completed';
  flightId?: string;
  flightNumber?: string;
  bookingReference?: string;
}

export default function MileageHistory() {
  const [mileageRecords, setMileageRecords] = useState<MileageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'earned' | 'used'>('all');
  const router = useRouter();

  useEffect(() => {
    const fetchMileageHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/miles/history');
        
        if (!response.ok) {
          throw new Error('獲取里程歷史記錄失敗');
        }
        
        const data = await response.json();
        setMileageRecords(data.records);
      } catch (err) {
        console.error('獲取里程歷史記錄失敗:', err);
        setError('獲取里程歷史記錄失敗，請稍後再試');
      } finally {
        setLoading(false);
      }
    };

    fetchMileageHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW');
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm('確定要刪除這筆里程記錄嗎？此操作不可恢復。')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/miles/${recordId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('刪除里程記錄失敗');
      }
      
      // 刪除成功，更新列表
      setMileageRecords(prev => prev.filter(record => record.id !== recordId));
    } catch (err) {
      console.error('刪除里程記錄失敗:', err);
      alert('刪除里程記錄失敗，請稍後再試');
    }
  };

  // 過濾里程記錄
  const filteredRecords = mileageRecords.filter(record => {
    const matchesSearch = 
      record.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.flightNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.bookingReference?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'earned' && record.type === 'earned') || 
      (filter === 'used' && record.type === 'used');
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            重試
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">里程歷史記錄</h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="搜尋記錄..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div className="flex">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-l-md ${filter === 'all' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                全部
              </button>
              <button
                onClick={() => setFilter('earned')}
                className={`px-4 py-2 ${filter === 'earned' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                獲得
              </button>
              <button
                onClick={() => setFilter('used')}
                className={`px-4 py-2 rounded-r-md ${filter === 'used' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                使用
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用戶
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日期
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  描述
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  類型
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  里程數
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record.userName || '未知用戶'}
                      </div>
                      <div className="text-xs text-gray-500">{record.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      <div>{record.description}</div>
                      {record.flightNumber && (
                        <div className="text-xs text-gray-400">
                          航班: {record.flightNumber} 
                          {record.bookingReference && ` | 預訂編號: ${record.bookingReference}`}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.type === 'earned' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {record.type === 'earned' ? '獲得' : '使用'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <span className={record.type === 'earned' ? 'text-green-600' : 'text-red-600'}>
                        {record.type === 'earned' ? '+' : '-'}{record.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status === 'completed' ? '已完成' : '處理中'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => router.push(`/admin/miles/edit/${record.id}`)}
                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                      >
                        編輯
                      </button>
                      <button 
                        onClick={() => handleDeleteRecord(record.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm || filter !== 'all' ? '沒有符合條件的里程記錄' : '沒有里程記錄'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
} 