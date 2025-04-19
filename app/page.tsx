'use client'

import Image from 'next/image';
import Link from 'next/link';
import FlightSearchForm from './components/FlightSearchForm';
import { useCurrency } from './contexts/CurrencyContext';
import CurrencySelector from './components/CurrencySelector';

export default function Home() {
  const { formatPrice } = useCurrency();

  // 特價航班數據（模擬）
  const specialDeals = [
    {
      id: 1,
      from: 'CAN',
      fromName: '廣州',
      to: 'HKG',
      toName: '香港',
      price: 1200,
      date: '2024-05-01',
      imageUrl: '/images/hk.png'
    },
    {
      id: 2,
      from: 'CAN',
      fromName: '廣州',
      to: 'BKK',
      toName: '曼谷',
      price: 1500,
      date: '2024-05-15',
      imageUrl: '/images/guangzhou.png'
    },
    {
      id: 3,
      from: 'CAN',
      fromName: '廣州',
      to: 'SIN',
      toName: '新加坡',
      price: 1800,
      date: '2024-06-01',
      imageUrl: '/images/Singapore.png'
    },
    {
      id: 4,
      from: 'CAN',
      fromName: '廣州',
      to: 'NRT',
      toName: '東京',
      price: 1600,
      date: '2024-05-20',
      imageUrl: '/images/tokyo.png'
    }
  ];

  // 熱門目的地
  const popularDestinations = [
    { id: 1, name: '東京', code: 'NRT', imageUrl: '/images/tokyo.png' },
    { id: 2, name: '香港', code: 'HKG', imageUrl: '/images/hk.png' },
    { id: 3, name: '廣州', code: 'CAN', imageUrl: '/images/guangzhou.png' },
    { id: 4, name: '新加坡', code: 'SIN', imageUrl: '/images/Singapore.png' },
    { id: 5, name: '倫敦', code: 'LHR', imageUrl: '/images/london.png' },
    { id: 6, name: '紐約', code: 'JFK', imageUrl: '/images/newyork.png' }
  ];

  return (
    <div className="min-h-screen">
      {/* 英雄區塊 */}
      <div className="bg-ya-yellow-500 pt-24 pb-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 flex flex-col justify-center">
              <div className="flex items-center mb-6">
                <Image 
                  src="/images/logoremovebkgnd.png" 
                  alt="黃色航空標誌"
                  width={80}
                  height={80}
                  className="h-16 w-auto mr-4"
                />
                <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
                  黃色航空
                </h1>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-black mb-2">
                探索世界的旅程，從黃航開始
              </p>
              <p className="mt-4 text-xl text-black">
                輕啟旅程，飛向更遠
              </p>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">搜索航班</h2>
                <FlightSearchForm />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-1/3 h-full opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#000000" d="M46.5,-78.3C60.3,-71.6,71.9,-60,78.1,-46.1C84.3,-32.1,85.1,-15.9,82.9,-1.3C80.7,13.4,75.4,26.9,68.2,39.1C61,51.4,51.9,62.4,40.2,69.8C28.4,77.3,14.2,81.1,-0.7,82.4C-15.6,83.7,-31.2,82.3,-44.5,75.9C-57.8,69.4,-68.8,57.9,-75.8,44.3C-82.8,30.8,-85.7,15.4,-84.7,0.6C-83.7,-14.2,-78.7,-28.4,-70.4,-40.2C-62.1,-52,-50.3,-61.3,-37.5,-68.4C-24.7,-75.5,-12.4,-80.3,1.5,-82.8C15.3,-85.2,30.5,-85.3,46.5,-78.3Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>

      {/* 特價航班區塊 */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">特價航班</h2>
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">貨幣:</span>
              <CurrencySelector />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {specialDeals.map((deal, index) => (
              <Link 
                href={`/flights?from=${deal.from}&to=${deal.to}&date=${deal.date}`} 
                key={deal.id}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                  <div className="h-48 w-full relative">
                    <Image 
                      src={deal.imageUrl}
                      alt={`${deal.fromName} 到 ${deal.toName}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority={index === 0}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-500">{deal.fromName}</span>
                        <span className="mx-2">→</span>
                        <span className="text-sm text-gray-500">{deal.toName}</span>
                      </div>
                      <div className="text-ya-yellow-500 font-bold">${formatPrice(deal.price)}</div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">{deal.date}</div>
                    <button className="mt-4 w-full bg-ya-yellow-500 hover:bg-ya-yellow-600 text-black py-2 rounded-md font-medium">
                      查看詳情
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 熱門目的地 */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">熱門目的地</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularDestinations.map((destination, index) => (
              <Link 
                href={`/flights?to=${destination.code}`} 
                key={destination.id}
                className="group"
              >
                <div className="relative h-64 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-transform duration-300 group-hover:-translate-y-1">
                  <Image 
                    src={destination.imageUrl}
                    alt={destination.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority={index < 2}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                      <p className="text-white text-sm mt-1">探索我們的優惠航班</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 旅行體驗 */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">黃色航空體驗</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-ya-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-ya-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">舒適客艙</h3>
              <p className="text-gray-600">體驗我們寬敞的座椅和優質的機上設施，讓您的旅程更加舒適。</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-ya-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-ya-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">機上餐飲</h3>
              <p className="text-gray-600">享受精心準備的美食和飲品，滿足您的味蕾。</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-ya-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-ya-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">貼心服務</h3>
              <p className="text-gray-600">我們的機組人員將為您提供卓越的服務，確保您的旅程愉快。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 