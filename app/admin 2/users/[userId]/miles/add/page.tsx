'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/app/admin/components/AdminLayout';
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  memberLevel: string;
  totalMiles: number;
}

const AddUserMilePage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    status: 'earned',
    description: '',
    relatedBookingId: ''
  });

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`);
      if (!response.ok) {
        throw new Error('無法獲取用戶數據');
      }
      
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('獲取用戶數據失敗:', error);
      toast.error('獲取用戶數據失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 驗證表單
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      toast.error('請輸入有效的里程數量');
      return;
    }
    
    if (!formData.description) {
      toast.error('請輸入描述');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/admin/users/${userId}/miles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount)
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '添加里程失敗');
      }
      
      toast.success('里程添加成功');
      router.push(`/admin/users/${userId}/miles`);
    } catch (error) {
      console.error('添加里程失敗:', error);
      toast.error(error instanceof Error ? error.message : '添加里程失敗，請稍後再試');
    } finally {
      setSubmitting(false);
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
          <Link href={`/admin/users/${userId}/miles`} className="mr-4 text-yellow-600 hover:text-yellow-800">
            <FaArrowLeft className="inline-block mr-1" /> 返回用戶里程詳情
          </Link>
          <h1 className="text-2xl font-bold">添加里程</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : !user ? (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
            <p className="text-yellow-700">無法找到此用戶</p>
            <Link 
              href="/admin/users/miles" 
              className="mt-2 inline-block px-4 py-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200"
            >
              返回用戶列表
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-lg font-medium mb-4">用戶資訊</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-700">
                    <span className="font-medium text-gray-900">姓名：</span> 
                    {user.name || '未設定'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    <span className="font-medium text-gray-900">電子郵件：</span> 
                    {user.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    <span className="font-medium text-gray-900">會員等級：</span> 
                    <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(user.memberLevel)}`}>
                      {user.memberLevel === 'standard' && '標準會員'}
                      {user.memberLevel === 'silver' && '銀卡會員'}
                      {user.memberLevel === 'gold' && '金卡會員'}
                      {user.memberLevel === 'diamond' && '鑽石會員'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      里程數量 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="請輸入里程數量"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      狀態 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    >
                      <option value="earned">獲得里程</option>
                      <option value="used">使用里程</option>
                      <option value="expired">過期里程</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="請輸入里程添加的原因或描述"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="relatedBookingId" className="block text-sm font-medium text-gray-700 mb-1">
                    相關訂單編號
                  </label>
                  <input
                    type="text"
                    id="relatedBookingId"
                    name="relatedBookingId"
                    value={formData.relatedBookingId}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="(選填) 請輸入相關訂單編號"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    如果此里程與特定訂單相關，請輸入訂單編號
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex items-center justify-end space-x-4">
                <Link
                  href={`/admin/users/${userId}/miles`}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  取消
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      處理中...
                    </>
                  ) : (
                    '添加里程'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AddUserMilePage; 