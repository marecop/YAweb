'use client';

import { useState, useEffect } from 'react';
import { getBookingById, cancelBooking, Booking } from '../../../../utils/bookingService';
import { FaCalendarAlt, FaPlane, FaUser, FaEnvelope, FaPhone, FaMoneyBillWave, FaTimes, FaCheck, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BookingDetailsPage() {
  const params = useParams();
  const bookingId = Array.isArray(params.bookingId) ? params.bookingId[0] : params.bookingId;
  
  const [booking, setBooking] = useState<Booking | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [action, setAction] = useState<'cancel' | 'confirm' | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setError('無效的預訂ID');
      setLoading(false);
      return;
    }

    try {
      const bookingData = getBookingById(bookingId);
      if (bookingData) {
        setBooking(bookingData);
      } else {
        setError('找不到預訂');
      }
    } catch (err) {
      console.error('獲取預訂詳情失敗:', err);
      setError('無法載入預訂詳情');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 顯示確認模態框
  const handleShowModal = (actionType: 'cancel' | 'confirm') => {
    setAction(actionType);
    setShowConfirmModal(true);
  };

  // 取消預訂
  const handleCancelBooking = () => {
    if (!booking) return;
    
    try {
      const success = cancelBooking(booking.id);
      if (success) {
        // 更新狀態
        setBooking({...booking, status: 'canceled'});
        setShowConfirmModal(false);
      } else {
        setError('取消預訂失敗');
      }
    } catch (err) {
      console.error('取消預訂出錯:', err);
      setError('處理請求時發生錯誤');
    }
  };
  
  // 確認預訂
  const handleConfirmBooking = () => {
    if (!booking) return;
    
    try {
      // 獲取所有預訂
      const allBookings = localStorage.getItem('yellairlines_bookings');
      if (allBookings) {
        const bookingsArray = JSON.parse(allBookings);
        const bookingIndex = bookingsArray.findIndex((b: Booking) => b.id === booking.id);
        
        if (bookingIndex !== -1) {
          // 更新狀態為已確認
          bookingsArray[bookingIndex].status = 'confirmed';
          // 保存回本地存儲
          localStorage.setItem('yellairlines_bookings', JSON.stringify(bookingsArray));
          
          // 更新狀態
          setBooking({...booking, status: 'confirmed'});
          setShowConfirmModal(false);
        } else {
          setError('找不到指定的預訂');
        }
      }
    } catch (err) {
      console.error('確認預訂出錯:', err);
      setError('處理請求時發生錯誤');
    }
  };

  // 執行對應操作
  const handleAction = () => {
    if (action === 'cancel') {
      handleCancelBooking();
    } else if (action === 'confirm') {
      handleConfirmBooking();
    }
    setShowConfirmModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ya-yellow-500"></div>
        <span className="ml-3 text-lg text-gray-700">載入預訂詳情中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <Link 
          href="/admin/bookings"
          className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          <FaArrowLeft className="mr-2" />
          返回預訂列表
        </Link>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">找不到預訂</h2>
        <p className="text-gray-600 mb-6">找不到ID為 {bookingId} 的預訂</p>
        <Link 
          href="/admin/bookings"
          className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          <FaArrowLeft className="mr-2" />
          返回預訂列表
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">預訂詳情</h1>
        <div className="flex gap-2">
          <Link 
            href="/admin/bookings"
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            <FaArrowLeft className="mr-2" />
            返回預訂列表
          </Link>
        </div>
      </div>

      {/* 預訂狀態 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <span className="block text-sm text-gray-500">預訂編號</span>
            <span className="text-xl font-semibold text-gray-900">{booking.id}</span>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
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
            <div className="ml-4 flex space-x-2">
              {booking.status === 'pending' && (
                <button
                  onClick={() => handleShowModal('confirm')}
                  className="inline-flex items-center px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
                >
                  <FaCheck className="mr-1" />
                  確認預訂
                </button>
              )}
              {booking.status !== 'canceled' && (
                <button
                  onClick={() => handleShowModal('cancel')}
                  className="inline-flex items-center px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                >
                  <FaTimes className="mr-1" />
                  取消預訂
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center mb-2">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-500">預訂日期</span>
            </div>
            <span className="text-md font-medium text-gray-900">
              {formatDate(booking.bookingDate)}
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center mb-2">
              <FaPlane className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-500">艙等</span>
            </div>
            <span className="text-md font-medium text-gray-900">
              {booking.cabinClass === 'economy' 
                ? '經濟艙' 
                : booking.cabinClass === 'business'
                  ? '商務艙'
                  : '頭等艙'}
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center mb-2">
              <FaUser className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-500">用戶 ID</span>
            </div>
            <Link href={`/admin/users/${booking.userId}`} className="text-md font-medium text-blue-600 hover:underline">
              {booking.userId}
            </Link>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center mb-2">
              <FaMoneyBillWave className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-500">總價</span>
            </div>
            <span className="text-md font-medium text-gray-900">
              NT$ {booking.totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 航班信息 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">航班資訊</h2>
        
        <div className="mb-6 border-b pb-6">
          <div className="flex items-center mb-2">
            <div className="w-12 h-12 flex items-center justify-center bg-ya-yellow-100 rounded-full mr-3">
              <FaPlane className="text-ya-yellow-500" />
            </div>
            <div>
              <span className="block text-sm text-gray-500">去程航班</span>
              <span className="block text-lg font-semibold text-gray-900">{booking.flightNumber}</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="block text-sm text-gray-500">出發地</span>
              <span className="block text-md font-medium text-gray-900">{booking.departure}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500">目的地</span>
              <span className="block text-md font-medium text-gray-900">{booking.destination}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500">出發日期和時間</span>
              <span className="block text-md font-medium text-gray-900">
                {formatDate(booking.departureDate)} {booking.departureTime}
              </span>
            </div>
          </div>
        </div>
        
        {booking.returnFlightNumber && (
          <div>
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 flex items-center justify-center bg-ya-yellow-100 rounded-full mr-3">
                <FaPlane className="text-ya-yellow-500 transform rotate-180" />
              </div>
              <div>
                <span className="block text-sm text-gray-500">回程航班</span>
                <span className="block text-lg font-semibold text-gray-900">{booking.returnFlightNumber}</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="block text-sm text-gray-500">出發地</span>
                <span className="block text-md font-medium text-gray-900">{booking.returnDeparture}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">目的地</span>
                <span className="block text-md font-medium text-gray-900">{booking.returnDestination}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">出發日期和時間</span>
                <span className="block text-md font-medium text-gray-900">
                  {booking.returnDepartureDate && formatDate(booking.returnDepartureDate)} {booking.returnDepartureTime}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 乘客和聯絡資訊 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">乘客資訊</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">類型</th>
                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">數量</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {booking.passengers.map((passenger, index) => (
                <tr key={index}>
                  <td className="py-3 text-sm text-gray-900">{passenger.label}</td>
                  <td className="py-3 text-sm text-gray-900">{passenger.count}</td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="py-3 text-sm font-medium text-gray-900">總人數</td>
                <td className="py-3 text-sm font-medium text-gray-900">
                  {booking.passengers.reduce((sum, p) => sum + p.count, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">聯絡資訊</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-1">
                <FaUser className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">聯絡人姓名</span>
              </div>
              <span className="block text-md font-medium text-gray-900">
                {booking.contactInfo.name}
              </span>
            </div>
            <div>
              <div className="flex items-center mb-1">
                <FaEnvelope className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">電子郵件</span>
              </div>
              <span className="block text-md font-medium text-gray-900">
                {booking.contactInfo.email}
              </span>
            </div>
            <div>
              <div className="flex items-center mb-1">
                <FaPhone className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">聯絡電話</span>
              </div>
              <span className="block text-md font-medium text-gray-900">
                {booking.contactInfo.phone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 確認模態框 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {action === 'cancel' ? '確定要取消此預訂？' : '確定要確認此預訂？'}
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                預訂: {booking.id}
              </p>
              <p className="text-sm text-gray-500">
                航班: {booking.flightNumber}
              </p>
              <p className="text-sm text-gray-500">
                乘客: {booking.contactInfo.name}
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
                  action === 'cancel'
                    ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500'
                    : 'bg-green-600 hover:bg-green-700 focus-visible:ring-green-500'
                }`}
                onClick={handleAction}
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