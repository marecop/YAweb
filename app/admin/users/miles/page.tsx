'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMemberLevelName, getMemberLevelColorClass } from '@/app/utils/memberUtils';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  memberLevel?: 'standard' | 'silver' | 'gold' | 'diamond';
  totalMiles?: number;
}

interface MileageRecord {
  id: string;
  userId: string;
  amount: number;
  type: 'earned' | 'used';
  description: string;
  details: string;
  date: string;
  status: 'pending' | 'completed';
  flightId?: string;
  flightNumber?: string;
  bookingReference?: string;
}

export default function UserMilesPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userMiles, setUserMiles] = useState<MileageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [milesLoading, setMilesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMileRecord, setNewMileRecord] = useState({
    amount: 1000,
    type: 'earned' as 'earned' | 'used',
    description: '',
    details: '',
    status: 'completed' as 'completed' | 'pending',
    flightNumber: '',
    bookingReference: ''
  });

  // 載入用戶數據
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'list',
            entityType: 'user'
          }),
        });

        if (!response.ok) {
          throw new Error('獲取用戶列表失敗');
        }

        const data = await response.json();
        setUsers(data.users || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : '發生未知錯誤');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 載入選定用戶的里程數據
  const loadUserMiles = async (userId: string) => {
    try {
      setMilesLoading(true);
      setSelectedUserId(userId);

      const response = await fetch(`/api/admin/users/${userId}/miles`);

      if (!response.ok) {
        throw new Error('獲取用戶里程數據失敗');
      }

      const data = await response.json();
      setUserMiles(data.history || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生未知錯誤');
    } finally {
      setMilesLoading(false);
    }
  };

  // 添加新里程記錄
  const handleAddMileRecord = async () => {
    if (!selectedUserId) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUserId}/miles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMileRecord),
      });

      if (!response.ok) {
        throw new Error('添加里程記錄失敗');
      }

      // 重新加載里程數據
      await loadUserMiles(selectedUserId);
      setShowAddModal(false);
      
      // 重置表單
      setNewMileRecord({
        amount: 1000,
        type: 'earned',
        description: '',
        details: '',
        status: 'completed',
        flightNumber: '',
        bookingReference: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生未知錯誤');
    }
  };

  // 用戶選擇處理
  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    if (userId) {
      loadUserMiles(userId);
    } else {
      setSelectedUserId(null);
      setUserMiles([]);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const selectedUser = users.find(user => user.id === selectedUserId);

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-6">用戶里程管理</h1>
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">選擇用戶</label>
          <select
            onChange={handleUserSelect}
            value={selectedUserId || ''}
            className="w-full md:w-64 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="">請選擇用戶</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName} ({user.email})
              </option>
            ))}
          </select>
        </div>
        
        {selectedUserId && selectedUser && (
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-2">
              {selectedUser.firstName} {selectedUser.lastName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-500">電子郵件:</span> 
                <span className="ml-2">{selectedUser.email}</span>
              </div>
              <div>
                <span className="text-gray-500">總里程:</span> 
                <span className="ml-2 font-medium">{selectedUser.totalMiles || 0}</span>
              </div>
              <div>
                <span className="text-gray-500">會員等級:</span> 
                <span className="ml-2">{getMemberLevelName(selectedUser.memberLevel || 'standard')}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md"
              >
                添加里程記錄
              </button>
            </div>
          </div>
        )}
        
        {selectedUserId && (
          <div>
            <h3 className="text-lg font-medium mb-4">里程記錄</h3>
            
            {milesLoading ? (
              <div className="text-center py-4">
                <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-2 text-gray-500">載入里程數據...</p>
              </div>
            ) : userMiles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">類型</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">數量</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">航班號</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userMiles.map(record => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.type === 'earned' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {record.type === 'earned' ? '獲得' : '使用'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {record.amount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div>{record.description}</div>
                          <div className="text-xs text-gray-400">{record.details}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.status === 'completed' ? '已完成' : '處理中'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.flightNumber || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">此用戶暫無里程記錄</p>
              </div>
            )}
          </div>
        )}
        
        {/* 添加里程模態框 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">添加里程記錄</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">類型</label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={newMileRecord.type}
                  onChange={(e) => setNewMileRecord({...newMileRecord, type: e.target.value as 'earned' | 'used'})}
                >
                  <option value="earned">獲得里程</option>
                  <option value="used">使用里程</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">數量</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={newMileRecord.amount}
                  onChange={(e) => setNewMileRecord({...newMileRecord, amount: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">描述</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={newMileRecord.description}
                  onChange={(e) => setNewMileRecord({...newMileRecord, description: e.target.value})}
                  placeholder="例如：國際航班獎勵"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">詳細信息</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={newMileRecord.details}
                  onChange={(e) => setNewMileRecord({...newMileRecord, details: e.target.value})}
                  placeholder="例如：管理員手動添加"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">狀態</label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={newMileRecord.status}
                  onChange={(e) => setNewMileRecord({...newMileRecord, status: e.target.value as 'completed' | 'pending'})}
                >
                  <option value="completed">已完成</option>
                  <option value="pending">處理中</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">航班號 (可選)</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={newMileRecord.flightNumber}
                  onChange={(e) => setNewMileRecord({...newMileRecord, flightNumber: e.target.value})}
                  placeholder="例如：YL123"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">訂票參考 (可選)</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={newMileRecord.bookingReference}
                  onChange={(e) => setNewMileRecord({...newMileRecord, bookingReference: e.target.value})}
                  placeholder="例如：ABCDEF"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button 
                  onClick={handleAddMileRecord}
                  className="px-4 py-2 bg-yellow-500 rounded-md text-white hover:bg-yellow-600"
                >
                  添加里程
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 