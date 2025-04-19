'use client';

import React, { useState, useEffect } from 'react';
import { calculateMemberLevel, getMemberLevelName, getMemberLevelColorClass } from '@/app/utils/memberUtils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEdit, FaTrash, FaSearch, FaArrowLeft, FaUser, FaCheck, FaTimes, FaAngleDown, FaAngleUp } from 'react-icons/fa';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  memberLevel?: 'standard' | 'silver' | 'gold' | 'diamond';
  totalMiles?: number;
}

export default function MemberLevelsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLevel, setEditLevel] = useState<'standard' | 'silver' | 'gold' | 'diamond'>('standard');

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
          throw new Error('獲取用戶失敗');
        }

        const data = await response.json();
        setUsers(data.users || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知錯誤');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 打開編輯模態框
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditLevel(user.memberLevel || 'standard');
    setShowEditModal(true);
  };

  // 更新會員等級
  const handleUpdateLevel = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          entityType: 'user',
          entityId: selectedUser.id,
          entityData: {
            memberLevel: editLevel
          }
        }),
      });

      if (!response.ok) {
        throw new Error('更新會員等級失敗');
      }

      // 更新本地用戶數據
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id ? { ...user, memberLevel: editLevel } : user
        )
      );
      
      setShowEditModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知錯誤');
    }
  };

  // 渲染等級標籤
  const renderLevelBadge = (level?: string) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMemberLevelColorClass(level || 'standard')}`}>
        {getMemberLevelName(level || 'standard')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-6">會員等級管理</h1>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">會員</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">電子郵件</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">總里程</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">計算等級</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">實際等級</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{user.totalMiles || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderLevelBadge(calculateMemberLevel(user.totalMiles || 0))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderLevelBadge(user.memberLevel)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleEditClick(user)}
                      className="text-yellow-600 hover:text-yellow-900 mr-2"
                    >
                      編輯等級
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 編輯模態框 */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">編輯會員等級</h2>
              <p className="mb-4">
                <span className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</span>
                <span className="text-gray-500 ml-2">({selectedUser.email})</span>
              </p>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">會員等級</label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value as any)}
                >
                  <option value="standard">普通會員</option>
                  <option value="silver">銀卡會員</option>
                  <option value="gold">金卡會員</option>
                  <option value="diamond">鑽石卡會員</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button 
                  onClick={handleUpdateLevel}
                  className="px-4 py-2 bg-yellow-500 rounded-md text-white hover:bg-yellow-600"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 