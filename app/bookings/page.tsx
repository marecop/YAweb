'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Booking, getBookingsByUserId } from '@/utils/bookingService';
import { useAuth } from '@/app/contexts/AuthContext';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import Link from 'next/link';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

export default function BookingsPage() { const router = useRouter();
  const {isLoggedIn, user, isLoading: authLoading} = useAuth();
  const [isLoading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    // 等待身份驗證完成
    if (authLoading) return;
    
    // 如果未登錄，重定向到登錄頁面
    if (!authLoading && !isLoggedIn) {
      router.push('/auth/login?redirect=/bookings');
      return;
    }
    
    // 加載預訂數據
    const loadBookings = () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // 使用用戶ID獲取預訂數據
        const userBookings = getBookingsByUserId(user.id);
        setBookings(userBookings);
      } catch (error) {
        console.error('加載預訂數據時出錯:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBookings();
  }, [authLoading, isLoggedIn, user, router]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy年MM月dd日', { locale: zhTW });
    } catch (error) {
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

  // 如果身份驗證正在加載，顯示加載中
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ya-yellow-500"></div>
        <span className="ml-3 text-lg text-gray-700">驗證身份中...</span>
      </div>
    );
  }

  // 如果未登錄，顯示提示
  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">請先登錄</h2>
          <p className="text-gray-600 mb-8">您需要登錄才能查看您的預訂。</p>
          <button
            onClick={() => router.push('/auth/login?redirect=/bookings')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500"
          >
            前往登錄
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">我的預訂</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ya-yellow-500"></div>
          <span className="ml-3 text-lg text-gray-700">載入預訂中...</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">您目前沒有預訂</h2>
          <p className="text-gray-600 mb-8">開始計劃您的下一次旅程吧！</p>
          <Link
            href="/flights"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500"
          >
            搜索航班
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* 預訂卡片列表 */}
          <div className="divide-y divide-gray-200">
            {bookings.map((booking) => {
              const statusInfo = getStatusInfo(booking.status);
              return (
                <div key={booking.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {booking.departure} 至 {booking.destination}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(booking.departureDate)}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0 flex flex-col items-end">
                      <p className="text-lg font-medium text-gray-900">
                        {formatPrice(booking.totalPrice)}
                      </p>
                      <div className="mt-2">
                        <Link
                          href={`/bookings/${booking.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500"
                        >
                          查看詳情
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 