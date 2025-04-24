'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { getBookingById, cancelBooking, Booking } from '../../../utils/bookingService';
import { useAuth } from '../../../contexts/AuthContext';
import { useCurrency } from '../../../contexts/CurrencyContext';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Head from 'next/head';
import { FaPlane, FaCalendarAlt, FaUser, FaClock, FaTag, FaTicketAlt } from 'react-icons/fa';
import Spinner from '@/app/components/Spinner';
import Alert from '@/app/components/Alert';

interface BookingDetailsPageProps {
  params: {
    bookingId: string;
  };
}

export default function BookingDetailsPage({ params }: BookingDetailsPageProps) {
  const { bookingId } = params;
  const router = useRouter();
  const {isLoggedIn, user, loading} = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { formatPrice } = useCurrency();
  const [statusUpdated, setStatusUpdated] = useState(false);

  useEffect(() => {
    // 防止在伺服器端運行
    if (typeof window === 'undefined') return;
    
    // 等待身份驗證完成
    if (loading) return;
    
    // 如果未登錄，重定向到登錄頁面
    if (!loading && !isLoggedIn) {
      router.push(`/auth/login?redirect=/bookings/${bookingId}`);
      return;
    }
    
    const loadBookingDetails = async () => {
      if (!bookingId || !user) {
        setError('無效的請求');
        setPageLoading(false);
        return;
      }
      
      setPageLoading(true);
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
        setPageLoading(false);
      }
    };

    loadBookingDetails();
  }, [bookingId, loading, isLoggedIn, user, router]);

  // 處理取消預訂
  const handleCancelBooking = async () => {
    if (!booking || !user) return;
    
    try {
      await cancelBooking(booking.id, user.id);
      setBooking(prev => prev ? { ...prev, status: 'canceled' } : null);
      setStatusUpdated(true);
      
      // 3秒後隱藏通知
      setTimeout(() => {
        setStatusUpdated(false);
      }, 3000);
    } catch (err) {
      console.error('取消預訂失敗', err);
      setError('無法取消預訂');
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

  if (loading || pageLoading) {
    return <Spinner />;
  }
  
  // 如果未登錄，顯示提示（通常不會到達這裡，因為會重定向）
  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">請先登錄</h2>
          <p className="text-gray-600 mb-8">您需要登錄才能查看預訂詳情。</p>
          <button
            onClick={() => router.push(`/auth/login?redirect=/bookings/${bookingId}`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500"
          >
            前往登錄
          </button>
        </div>
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
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Booking Details | Yellow Airlines</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6 text-yellow-700">Booking Details</h1>

      {statusUpdated && (
        <Alert type="success" message="預訂狀態已更新" />
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Flight {booking.flightNumber}
            </h2>
            <span className={`px-4 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <FaPlane className="text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Flight Route</p>
                  <p className="font-medium text-gray-800">{booking.departure} to {booking.destination}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaCalendarAlt className="text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Departure Date</p>
                  <p className="font-medium text-gray-800">{formatDate(booking.departureDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaClock className="text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Departure Time</p>
                  <p className="font-medium text-gray-800">{booking.departureTime}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <FaUser className="text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Passenger</p>
                  <p className="font-medium text-gray-800">
                    {booking.passengers.map(p => `${p.label} (${p.count})`).join(', ')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaTag className="text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Booking Class</p>
                  <p className="font-medium text-gray-800">
                    {booking.cabinClass === 'economy' ? 'Economy' : 
                     booking.cabinClass === 'business' ? 'Business' : 'First Class'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaTicketAlt className="text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Booking Reference</p>
                  <p className="font-medium text-gray-800">{booking.id}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleBackToBookings}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-4"
            >
              Back to Bookings
            </button>
            
            {!isPast && !isCanceled && (
              <button
                onClick={handleCancelBooking}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}