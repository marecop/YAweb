'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaArrowUp, FaArrowDown, FaEdit, FaTrash, FaUser, FaPlus, FaSpinner, FaTimes, FaCheck } from 'react-icons/fa';

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
  userInfo?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  memberLevel?: string;
}

export default function MilesManagement() {
  const [mileageRecords, setMileageRecords] = useState<MileageRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // 新增里程記錄表單數據
  const [newMileRecord, setNewMileRecord] = useState({
    userId: '',
    amount: 1000,
    type: 'earned',
    description: '',
    details: '',
    status: 'completed'
  });

  // 獲取里程記錄
  const fetchMileageRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'list',
          entityType: 'mileage'
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('獲取里程數據失敗');
      }

      const data = await response.json();
      
      // 數據預處理：添加用戶信息
      const records = data.miles || [];
      const recordsWithUserInfo = records.map((record: MileageRecord) => {
        const user = users.find(u => u.id === record.userId);
        return {
          ...record,
          userInfo: user ? {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          } : undefined
        };
      });
      
      setMileageRecords(recordsWithUserInfo);
      setError(null);
    } catch (err) {
      console.error('獲取里程記錄失敗:', err);
      setError('無法載入里程數據，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  // 獲取用戶列表
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'list',
          entityType: 'user'
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('獲取用戶數據失敗');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('獲取用戶列表失敗:', err);
    }
  };

  // 初始加載數據
  useEffect(() => {
    const loadData = async () => {
      await fetchUsers();
      await fetchMileageRecords();
    };
    
    loadData();
  }, []);

  // 計算用戶總里程數
  const getUserTotalMiles = (userId: string) => {
    const userRecords = mileageRecords.filter(record => record.userId === userId);
    return userRecords.reduce((total, record) => {
      return total + (record.type === 'earned' ? record.amount : -record.amount);
    }, 0);
  };

  // 獲取用戶資訊
  const getUserInfo = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName} (${user.email})` : userId;
  };

  // 過濾里程記錄
  const filteredRecords = mileageRecords.filter(record => {
    const matchesSearch = 
      (record.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.userInfo?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (record.userInfo?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (record.userInfo?.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()));
    
    const matchesUser = selectedUserId ? record.userId === selectedUserId : true;
    
    return matchesSearch && matchesUser;
  });

  // 根據里程記錄狀態獲取顏色
  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  // 獲取唯一用戶列表
  const uniqueUsers = Array.from(new Set(mileageRecords.map(record => record.userId)))
    .map(userId => {
      const user = users.find(u => u.id === userId);
      return {
        id: userId,
        name: user ? `${user.firstName} ${user.lastName}` : userId,
        miles: getUserTotalMiles(userId)
      };
    })
    .sort((a, b) => b.miles - a.miles);

  // 處理新增里程記錄表單變更
  const handleNewMileRecordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMileRecord(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseInt(value) || 0 : value
    }));
  };

  // 創建新里程記錄
  const createMileRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (!newMileRecord.userId) {
        setError('請選擇會員');
        setLoading(false);
        return;
      }
      
      if (!newMileRecord.description) {
        setError('請輸入描述');
        setLoading(false);
        return;
      }
      
      if (newMileRecord.amount <= 0) {
        setError('里程數量必須大於0');
        setLoading(false);
        return;
      }
      
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          entityType: 'mileage',
          entityData: newMileRecord
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('創建里程記錄失敗');
      }

      const data = await response.json();
      
      // 重置表單
      setNewMileRecord({
        userId: '',
        amount: 1000,
        type: 'earned',
        description: '',
        details: '',
        status: 'completed'
      });
      
      // 關閉模態窗口
      setShowAddModal(false);
      
      // 更新里程記錄列表
      await fetchMileageRecords();
      
      // 顯示成功消息
      setSuccessMessage('里程記錄已成功創建');
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err) {
      console.error('創建里程記錄失敗:', err);
      setError('創建里程記錄時出錯，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  if (loading && mileageRecords.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ya-yellow-500"></div>
        <span className="ml-3 text-lg text-gray-700">載入里程數據中...</span>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">里程管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            管理所有用戶的里程積分，包括獲取和使用記錄。
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-ya-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-ya-yellow-500 focus:ring-offset-2 sm:w-auto"
          >
            <FaPlus className="mr-2" /> 新增里程記錄
          </button>
        </div>
      </div>

      {/* 成功消息 */}
      {successMessage && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaCheck className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* 錯誤消息 */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaTimes className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">錯誤</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        {/* 側邊欄：用戶里程總覽 */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                用戶里程總覽
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                按會員顯示總里程數量
              </p>
            </div>
            <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              <li 
                key="all" 
                className={`cursor-pointer hover:bg-gray-50 ${selectedUserId === null ? 'bg-ya-yellow-50' : ''}`}
                onClick={() => setSelectedUserId(null)}
              >
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <FaUser className="text-gray-400 mr-3" />
                    <span className="truncate text-sm font-medium text-gray-900">所有用戶</span>
                  </div>
                </div>
              </li>
              {uniqueUsers.map((user) => (
                <li 
                  key={user.id} 
                  className={`cursor-pointer hover:bg-gray-50 ${selectedUserId === user.id ? 'bg-ya-yellow-50' : ''}`}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 mr-3" />
                      <span className="truncate text-sm font-medium text-gray-900">{user.name}</span>
                    </div>
                    <span className={`inline-flex text-sm ${user.miles >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {user.miles.toLocaleString()} 點
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 里程記錄列表 */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                里程記錄
              </h3>
              <div className="mt-1 flex rounded-md shadow-sm">
                <div className="relative flex items-stretch flex-grow">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="focus:ring-ya-yellow-500 focus:border-ya-yellow-500 block w-full rounded-md sm:text-sm border-gray-300"
                    placeholder="搜尋記錄..."
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      日期
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      用戶
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      描述
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      里程數
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      狀態
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.userInfo ? `${record.userInfo.firstName} ${record.userInfo.lastName}` : record.userId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div>{record.description}</div>
                          {record.details && <div className="text-xs text-gray-400">{record.details}</div>}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${record.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                          {record.type === 'earned' ? '+' : '-'}{record.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                            {record.status === 'completed' ? '已完成' : '處理中'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                        {selectedUserId 
                          ? '此用戶沒有里程記錄' 
                          : '沒有符合條件的里程記錄'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 新增里程記錄模態窗口 */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* 對話框面板 */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={createMileRecord}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        新增里程記錄
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                            會員
                          </label>
                          <select
                            id="userId"
                            name="userId"
                            value={newMileRecord.userId}
                            onChange={handleNewMileRecordChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm rounded-md"
                            required
                          >
                            <option value="">選擇會員</option>
                            {users.map(user => (
                              <option key={user.id} value={user.id}>
                                {user.firstName} {user.lastName} ({user.email})
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            類型
                          </label>
                          <select
                            id="type"
                            name="type"
                            value={newMileRecord.type}
                            onChange={handleNewMileRecordChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm rounded-md"
                          >
                            <option value="earned">獲得里程</option>
                            <option value="used">使用里程</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            里程數量
                          </label>
                          <input
                            type="number"
                            name="amount"
                            id="amount"
                            value={newMileRecord.amount}
                            onChange={handleNewMileRecordChange}
                            min="1"
                            className="mt-1 focus:ring-ya-yellow-500 focus:border-ya-yellow-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            描述
                          </label>
                          <input
                            type="text"
                            name="description"
                            id="description"
                            value={newMileRecord.description}
                            onChange={handleNewMileRecordChange}
                            className="mt-1 focus:ring-ya-yellow-500 focus:border-ya-yellow-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                            詳細資訊 (選填)
                          </label>
                          <textarea
                            name="details"
                            id="details"
                            rows={3}
                            value={newMileRecord.details}
                            onChange={handleNewMileRecordChange}
                            className="mt-1 focus:ring-ya-yellow-500 focus:border-ya-yellow-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            狀態
                          </label>
                          <select
                            id="status"
                            name="status"
                            value={newMileRecord.status}
                            onChange={handleNewMileRecordChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm rounded-md"
                          >
                            <option value="completed">已完成</option>
                            <option value="pending">處理中</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-ya-yellow-600 text-base font-medium text-white hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500 sm:ml-3 sm:w-auto sm:text-sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        處理中...
                      </>
                    ) : '創建記錄'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 