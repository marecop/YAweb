'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface MileageRecord {
  id: string;
  userId: string;
  amount: number;
  status: 'earned' | 'used' | 'expired';
  description: string;
  createdAt: string;
  relatedBookingId?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  memberLevel: string;
  totalMiles: number;
}

interface MileageData {
  user: User;
  totalMiles: number;
  availableMiles: number;
  expireDate: string;
  records: MileageRecord[];
}

const UserMilesDetailPage = () => {
  const params = useParams();
  const userId = params.userId as string;
  
  const [mileageData, setMileageData] = useState<MileageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMileageData();
  }, [userId]);

  const fetchMileageData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/users/${userId}/miles`);
      if (!response.ok) {
        throw new Error('無法獲取用戶里程數據');
      }
      
      const data = await response.json();
      setMileageData(data);
    } catch (error) {
      console.error('獲取里程數據失敗:', error);
      setError('獲取里程數據失敗，請稍後再試');
      toast.error('獲取里程數據失敗');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'earned': return '獲得';
      case 'used': return '使用';
      case 'expired': return '過期';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'earned': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'silver':
        return 'bg-gray-300 text-gray-800';
      case 'gold':
        return 'bg-yellow-400 text-yellow-800';
      case 'diamond':
        return 'bg-blue-300 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/admin/users/miles" className="mr-4 text-yellow-600 hover:text-yellow-800">
            <FaArrowLeft className="inline-block mr-1" /> 返回用戶列表
          </Link>
          <h1 className="text-2xl font-bold">用戶里程詳情</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-6">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={fetchMileageData} 
              className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
            >
              重試
            </button>
          </div>
        ) : mileageData ? (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">用戶資訊</h2>
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-900">姓名：</span> 
                      {mileageData.user.name || '未設定'}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-900">電子郵件：</span> 
                      {mileageData.user.email}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-900">會員等級：</span> 
                      <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(mileageData.user.memberLevel)}`}>
                        {mileageData.user.memberLevel === 'standard' && '標準會員'}
                        {mileageData.user.memberLevel === 'silver' && '銀卡會員'}
                        {mileageData.user.memberLevel === 'gold' && '金卡會員'}
                        {mileageData.user.memberLevel === 'diamond' && '鑽石會員'}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-4">里程概況</h2>
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-900">總里程：</span> 
                      <span className="text-yellow-600 font-medium">{mileageData.totalMiles.toLocaleString()}</span> 里程
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-900">可用里程：</span> 
                      <span className="text-green-600 font-medium">{mileageData.availableMiles.toLocaleString()}</span> 里程
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-900">到期日期：</span> 
                      {formatDate(mileageData.expireDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-wrap items-center justify-between mb-6">
                <h2 className="text-lg font-medium">里程記錄</h2>
                <Link 
                  href={`/admin/users/${userId}/miles/add`} 
                  className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  <FaPlus className="mr-2" /> 添加里程
                </Link>
              </div>
              
              {mileageData.records.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          日期
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          狀態
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          里程數
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          描述
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          訂單編號
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mileageData.records.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDateTime(record.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                              {getStatusText(record.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.status === 'earned' ? (
                              <span className="text-green-600 font-medium">+{record.amount.toLocaleString()}</span>
                            ) : (
                              <span className="text-red-600 font-medium">-{record.amount.toLocaleString()}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.relatedBookingId ? (
                              <Link href={`/admin/bookings/${record.relatedBookingId}`} className="text-yellow-600 hover:text-yellow-800">
                                {record.relatedBookingId.substring(0, 8)}...
                              </Link>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  此用戶尚無里程記錄
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
            <p className="text-yellow-700">無法找到此用戶的里程資料</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserMilesDetailPage; 