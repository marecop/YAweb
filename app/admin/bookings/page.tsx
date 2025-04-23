'use client';

import { useState, useEffect } from 'react';
import { getAllBookings, cancelBooking, Booking } from '../../../utils/bookingService';
import { FaSearch, FaEdit, FaTimes, FaCheck, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<'cancel' | 'confirm' | null>(null);

  useEffect(() => {
    // 獲取所有預訂數據
    try {
      const allBookings = getAllBookings();
      setBookings(allBookings);
    } catch (err) {
      console.error('獲取預訂失敗:', err);
      setError('無法載入預訂數據');
    } finally {
      setLoading(false);
    }
  }, []);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 過濾預訂
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contactInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // 顯示確認模態框
  const handleShowModal = (booking: Booking, action: 'cancel' | 'confirm') => {
    setSelectedBooking(booking);
    setSelectedAction(action);
    setShowConfirmModal(true);
  };

  // 執行取消預訂
  const handleCancelBooking = () => {
    if (!selectedBooking) return;
    
    try {
      const success = cancelBooking(selectedBooking.id);
      if (success) {
        // 更新預訂列表
        setBookings(bookings.map(booking => 
          booking.id === selectedBooking.id 
            ? {...booking, status: 'canceled'} 
            : booking
        ));
        setShowConfirmModal(false);
        setSelectedBooking(null);
      } else {
        setError('取消預訂失敗');
      }
    } catch (err) {
      console.error('取消預訂出錯:', err);
      setError('處理請求時發生錯誤');
    }
  };

  // 更新預訂狀態
  const handleUpdateStatus = () => {
    if (!selectedBooking) return;
    
    try {
      // 獲取所有預訂
      const allBookings = getAllBookings();
      // 找到要更新的預訂
      const bookingIndex = allBookings.findIndex(b => b.id === selectedBooking.id);
      
      if (bookingIndex !== -1) {
        // 更新狀態為已確認
        allBookings[bookingIndex].status = 'confirmed';
        // 保存回本地存儲
        localStorage.setItem('yellairlines_bookings', JSON.stringify(allBookings));
        
        // 更新狀態
        setBookings(allBookings);
        setShowConfirmModal(false);
        setSelectedBooking(null);
      } else {
        setError('找不到指定的預訂');
      }
    } catch (err) {
      console.error('更新預訂狀態出錯:', err);
      setError('處理請求時發生錯誤');
    }
  };

  // 確認操作
  const handleConfirmAction = () => {
    if (selectedAction === 'cancel') {
      handleCancelBooking();
    } else if (selectedAction === 'confirm') {
      handleUpdateStatus();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ya-yellow-500"></div>
        <span className="ml-3 text-lg text-gray-700">載入預訂數據中...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">預訂管理</h1>
        <div className="flex gap-2">
          <Link 
            href="/admin"
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            返回儀表板
          </Link>
        </div>
      </div>

      {/* 搜索和過濾 */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-ya-yellow-500 focus:border-transparent"
            placeholder="搜尋預訂編號、航班號或乘客"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ya-yellow-500 focus:border-transparent"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">所有狀態</option>
            <option value="confirmed">已確認</option>
            <option value="pending">待處理</option>
            <option value="canceled">已取消</option>
          </select>
        </div>
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 預訂列表 */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  預訂編號
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  航班號
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  路線
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  乘客
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  預訂日期
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{booking.id}</div>
                      <div className="text-sm text-gray-500">
                        {`${booking.cabinClass.charAt(0).toUpperCase() + booking.cabinClass.slice(1)} 艙`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.flightNumber}</div>
                      {booking.returnFlightNumber && (
                        <div className="text-sm text-gray-500">回程: {booking.returnFlightNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.departure} → {booking.destination}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(booking.departureDate)} {booking.departureTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.contactInfo.name}</div>
                      <div className="text-sm text-gray-500">{booking.contactInfo.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.bookingDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status === 'confirmed' 
                          ? '已確認' 
                          : booking.status === 'pending'
                            ? '待處理'
                            : '已取消'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/admin/bookings/${booking.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FaInfoCircle className="h-5 w-5" />
                        </Link>
                        
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleShowModal(booking, 'confirm')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <FaCheck className="h-5 w-5" />
                          </button>
                        )}
                        
                        {booking.status !== 'canceled' && (
                          <button
                            onClick={() => handleShowModal(booking, 'cancel')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTimes className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm || filterStatus !== 'all'
                      ? '沒有符合篩選條件的預訂'
                      : '沒有找到任何預訂'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 確認模態框 */}
      {showConfirmModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedAction === 'cancel' ? '確定要取消此預訂？' : '確定要確認此預訂？'}
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                預訂: {selectedBooking.id}
              </p>
              <p className="text-sm text-gray-500">
                航班: {selectedBooking.flightNumber}
              </p>
              <p className="text-sm text-gray-500">
                乘客: {selectedBooking.contactInfo.name}
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ya-yellow-500"
                onClick={() => setShowConfirmModal(false)}
              >
                取消
              </button>
              <button
                type="button"
                className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  selectedAction === 'cancel'
                    ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500'
                    : 'bg-green-600 hover:bg-green-700 focus-visible:ring-green-500'
                }`}
                onClick={handleConfirmAction}
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 