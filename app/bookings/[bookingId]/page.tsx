'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { getBookingById, cancelBooking, Booking } from '../../../utils/bookingService';
import { useAuth } from '../../../contexts/AuthContext';
import { useCurrency } from '../../../contexts/CurrencyContext';

interface BookingDetailsPageProps {
  params: {
    bookingId: string;
  };
}

export default function BookingDetailsPage({ params }: BookingDetailsPageProps) {
  const { bookingId } = params;
  const router = useRouter();
  const { isLoggedIn, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    // 防止在伺服器端運行
    if (typeof window === 'undefined') return;
    
    // 等待身份驗證完成
    if (authLoading) return;
    
    // 如果未登錄，重定向到登錄頁面
    if (!authLoading && !isLoggedIn) {
      router.push(`/login?redirect=/bookings/${bookingId}`);
      return;
    }
    
    const loadBookingDetails = async () => {
      if (!bookingId || !user) {
        setError('無效的請求');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const bookingData = getBookingById(bookingId);
        
        // 檢查是否找到預訂
        if (!bookingData) {
          setError('找不到預訂記錄');
          setBooking(null);
          return;
        }
        
        // 檢查預訂是否屬於當前用戶
        if (bookingData.userId !== user.id) {
          setError('您無權查看此預訂');
          setBooking(null);
          return;
        }
        
        setBooking(bookingData);
        setError(null);
      } catch (error) {
        console.error('加載預訂詳情時出錯:', error);
        setError('加載預訂詳情時出錯');
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };

    loadBookingDetails();
  }, [bookingId, authLoading, isLoggedIn, user, router]);

  // 處理取消預訂
  const handleCancelBooking = () => {
    if (!booking || !user) return;
    
    if (window.confirm('您確定要取消此預訂嗎？此操作無法撤銷。')) {
      const success = cancelBooking(booking.id, user.id);
      
      if (success) {
        // 更新本地狀態
        setBooking(prev => prev ? { ...prev, status: 'canceled' } : null);
      } else {
        alert('取消預訂失敗，請稍後再試');
      }
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy年MM月dd日 (EEEE)', { locale: zhTW });
    } catch (error) {
      console.error('日期格式化錯誤:', error);
      return dateString;
    }
  };

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

  // 處理返回我的預訂
  const handleBackToBookings = () => {
    router.push('/bookings');
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
  
  // 如果未登錄，顯示提示（通常不會到達這裡，因為會重定向）
  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">請先登錄</h2>
          <p className="text-gray-600 mb-8">您需要登錄才能查看預訂詳情。</p>
          <button
            onClick={() => router.push(`/login?redirect=/bookings/${bookingId}`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500"
          >
            前往登錄
          </button>
        </div>
      </div>
    );
  }

  // 如果正在加載，顯示加載中
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ya-yellow-500"></div>
        <span className="ml-3 text-lg text-gray-700">載入預訂詳情中...</span>
      </div>
    );
  }

  // 如果有錯誤，顯示錯誤提示
  if (error || !booking) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">{error || '找不到預訂詳情'}</h2>
          <p className="text-gray-600 mb-8">請返回預訂列表查看您的其他預訂。</p>
          <button
            onClick={handleBackToBookings}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500"
          >
            返回我的預訂
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(booking.status);
  const isPast = new Date(booking.departureDate) < new Date();
  const isCanceled = booking.status === 'canceled';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">預訂詳情</h1>
          <p className="mt-2 text-lg text-gray-600">查看您的航班預訂詳細信息。</p>
        </div>
        <button
          onClick={handleBackToBookings}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          返回預訂列表
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              訂單編號: {booking.id}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              預訂日期: {formatDate(booking.bookingDate)}
            </p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">航班信息</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-medium text-gray-800 mb-2">去程航班</h4>
            <div className="flex items-center justify-between flex-wrap">
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {booking.departure} → {booking.destination}
                </div>
                <div className="text-gray-600 mt-1">
                  {formatDate(booking.departureDate)} • {booking.departureTime}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {booking.flightNumber} • {
                    booking.cabinClass === 'economy' ? '經濟艙' :
                    booking.cabinClass === 'business' ? '商務艙' : '頭等艙'
                  }
                </div>
              </div>
            </div>
          </div>
          
          {booking.returnFlightNumber && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-gray-800 mb-2">回程航班</h4>
              <div className="flex items-center justify-between flex-wrap">
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    {booking.returnDeparture} → {booking.returnDestination}
                  </div>
                  <div className="text-gray-600 mt-1">
                    {booking.returnDepartureDate ? formatDate(booking.returnDepartureDate) : ''} • {booking.returnDepartureTime || ''}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {booking.returnFlightNumber} • {
                      booking.cabinClass === 'economy' ? '經濟艙' :
                      booking.cabinClass === 'business' ? '商務艙' : '頭等艙'
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">旅客信息</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {booking.passengers.map((passenger, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800">{passenger.label} {index + 1}</h4>
                <p className="text-gray-600 mt-1">數量: {passenger.count} 名</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">聯繫信息</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700"><span className="font-medium">聯繫人:</span> {booking.contactInfo.name}</p>
            <p className="text-gray-700 mt-2"><span className="font-medium">電話:</span> {booking.contactInfo.phone}</p>
            <p className="text-gray-700 mt-2"><span className="font-medium">電子郵箱:</span> {booking.contactInfo.email}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">價格與付款</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">總價</span>
              <span className="text-xl font-bold text-ya-yellow-700">{formatPrice(booking.totalPrice)}</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">包含稅費和服務費</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            如需幫助，請聯繫客服: support@yellairlines.com
          </div>
          
          {!isPast && !isCanceled && (
            <button
              onClick={handleCancelBooking}
              className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              取消預訂
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 