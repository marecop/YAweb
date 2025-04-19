'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { useAuth } from '@/app/contexts/AuthContext';
import { getBookingsByUserId, cancelBooking, Booking } from '@/utils/bookingService';
import { useCurrency } from '@/app/contexts/CurrencyContext';

export default function BookingsPage() {
  const router = useRouter();
  const { isLoggedIn, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    // 防止在伺服器端運行
    if (typeof window === 'undefined') return;
    
    // 僅當認證加載完成後才繼續
    if (authLoading) return;
    
    // 如果未登錄，重定向到登錄頁面
    if (!authLoading && !isLoggedIn) {
      router.push('/login?redirect=/bookings');
      return;
    }
    
    const loadBookings = async () => {
      if (!user) {
        setBookings([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // 根據用戶ID獲取預訂數據
        const userBookings = getBookingsByUserId(user.id);
        setBookings(userBookings);
      } catch (error) {
        console.error('獲取預訂數據時發生錯誤:', error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    // 加載預訂數據
    loadBookings();
  }, [authLoading, isLoggedIn, user, router]);

  // 獲取狀態相關信息（標籤文字和顏色）
  const getStatusInfo = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return { label: '已確認', color: 'bg-green-100 text-green-800' };
      case 'pending':
        return { label: '處理中', color: 'bg-yellow-100 text-yellow-800' };
      case 'canceled':
        return { label: '已取消', color: 'bg-red-100 text-red-800' };
      default:
        return { label: '未知', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // 格式化日期為中文格式
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy年MM月dd日 (EEEE)', { locale: zhTW });
    } catch (error) {
      console.error('日期格式化錯誤:', error);
      return dateString;
    }
  };

  // 處理查看詳情
  const handleViewDetails = (bookingId: string) => {
    router.push(`/bookings/${bookingId}`);
  };

  // 處理取消預訂
  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('您確定要取消此預訂嗎？此操作無法撤銷。')) {
      // 確保僅取消當前用戶的預訂
      const success = user ? cancelBooking(bookingId, user.id) : false;
      
      if (success) {
        // 更新本地狀態
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId ? { ...booking, status: 'canceled' } : booking
        ));
      } else {
        alert('取消預訂失敗，請稍後再試');
      }
    }
  };
  
  // 如果認證正在加載，顯示加載中
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ya-yellow-500"></div>
        <span className="ml-3 text-lg text-gray-700">驗證身份中...</span>
      </div>
    );
  }
  
  // 如果未登錄，顯示登錄提示（通常不會到達這裡，因為會重定向到登錄頁面）
  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">請先登錄</h2>
          <p className="text-gray-600 mb-8">您需要登錄才能查看預訂記錄。</p>
          <button
            onClick={() => router.push('/login?redirect=/bookings')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500"
          >
            前往登錄
          </button>
        </div>
      </div>
    );
  }

  // 如果預訂數據正在加載，顯示加載中
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ya-yellow-500"></div>
        <span className="ml-3 text-lg text-gray-700">載入預訂資訊中...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">我的預訂</h1>
        <p className="mt-2 text-lg text-gray-600">
          {user ? `歡迎回來，${user.firstName}。以下是您的航班預訂記錄。` : '以下是您的航班預訂記錄。'}
        </p>
      </div>

      {bookings.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => {
              const statusInfo = getStatusInfo(booking.status);
              const isPast = new Date(booking.departureDate) < new Date();
              const isCanceled = booking.status === 'canceled';

              return (
                <li key={booking.id} className="p-4 sm:p-6">
                  <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center space-x-2">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {booking.departure} → {booking.destination}
                        </h2>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-col sm:flex-row sm:space-x-6">
                        <p className="text-gray-700">
                          <span className="font-medium">航班號:</span> {booking.flightNumber}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">出發日期:</span> {formatDate(booking.departureDate)}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">出發時間:</span> {booking.departureTime}
                        </p>
                      </div>

                      {booking.returnFlightNumber && (
                        <div className="mt-2 flex flex-col sm:flex-row sm:space-x-6">
                          <p className="text-gray-700">
                            <span className="font-medium">回程航班號:</span> {booking.returnFlightNumber}
                          </p>
                          {booking.returnDepartureDate && (
                            <p className="text-gray-700">
                              <span className="font-medium">回程日期:</span> {formatDate(booking.returnDepartureDate)}
                            </p>
                          )}
                          {booking.returnDepartureTime && (
                            <p className="text-gray-700">
                              <span className="font-medium">回程時間:</span> {booking.returnDepartureTime}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="mt-2 flex flex-col sm:flex-row sm:space-x-6">
                        <p className="text-gray-700">
                          <span className="font-medium">旅客數:</span> {booking.passengers.reduce((total, p) => total + p.count, 0)} 人
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">艙等:</span> {
                            booking.cabinClass === 'economy' ? '經濟艙' :
                            booking.cabinClass === 'business' ? '商務艙' : '頭等艙'
                          }
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">總價:</span> 
                          <span className="ml-1 text-ya-yellow-700 font-semibold">
                            {formatPrice(booking.totalPrice)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={() => handleViewDetails(booking.id)}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500"
                      >
                        查看詳情
                      </button>
                      
                      {!isPast && !isCanceled && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          取消預訂
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">您還沒有預訂記錄</h2>
          <p className="text-gray-600 mb-8">立即開始搜索航班，規劃您的下一次旅行！</p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500"
          >
            搜索航班
          </button>
        </div>
      )}
    </div>
  );
} 