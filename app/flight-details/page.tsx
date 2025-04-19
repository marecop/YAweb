'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Flight } from '@/types/Flight';
import { format, addMinutes, addHours } from 'date-fns';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import Link from 'next/link';
import { ArrowLeftIcon, ArrowRightIcon, ClockIcon, CalendarIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

// 航空公司標誌映射
const airlineLogos: Record<string, string> = {
  'YA': '/images/airlines/yellow-airlines.png',
  'CA': '/images/airlines/yellow-airlines.png',
  'CZ': '/images/airlines/yellow-airlines.png',
  'MU': '/images/airlines/yellow-airlines.png',
  'SQ': '/images/airlines/yellow-airlines.png',
  'CX': '/images/airlines/yellow-airlines.png',
  'JL': '/images/airlines/yellow-airlines.png',
  'KE': '/images/airlines/yellow-airlines.png',
  'LH': '/images/airlines/yellow-airlines.png',
  'LX': '/images/airlines/yellow-airlines.png'
};

// 獲取航空公司代碼
function getAirlineCode(flightNumber: string): string {
  return flightNumber.substring(0, 2);
}

// 獲取航空公司名稱
function getAirlineName(airlineCode: string): string {
  switch (airlineCode) {
    case 'YA': return 'Yellow Airlines';
    case 'CA': return '中國國際航空';
    case 'CZ': return '中國南方航空';
    case 'MU': return '中國東方航空';
    case 'SQ': return '新加坡航空';
    case 'CX': return '國泰航空';
    case 'JL': return '日本航空';
    case 'KE': return '大韓航空';
    case 'LH': return 'Lufthansa';
    case 'LX': return 'Swiss International Air Lines';
    default: return 'Yellow Airlines';
  }
}

export default function FlightDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flightId = searchParams.get('flightId');
  const { formatPrice } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 從緩存中載入航班數據
    const loadFlightData = async () => {
      setLoading(true);
      try {
        // 從本地存儲中獲取航班數據
        const cachedFlights = localStorage.getItem('flights_data');
        
        if (!cachedFlights) {
          setError('找不到航班數據');
          setLoading(false);
          return;
        }
        
        const flights: Flight[] = JSON.parse(cachedFlights);
        const foundFlight = flights.find(f => f.id === flightId);
        
        if (!foundFlight) {
          setError('找不到指定航班');
          setLoading(false);
          return;
        }
        
        setFlight(foundFlight);
      } catch (err) {
        console.error('載入航班詳情失敗:', err);
        setError('載入航班詳情時發生錯誤');
      } finally {
        setLoading(false);
      }
    };
    
    if (flightId) {
      loadFlightData();
    } else {
      setError('未提供航班ID');
      setLoading(false);
    }
  }, [flightId]);

  // 格式化時間
  const formatTime = (date: Date) => format(date, 'HH:mm');
  
  // 格式化日期
  const formatDate = (date: Date) => format(date, 'yyyy年MM月dd日 (EEEE)');
  
  // 格式化持續時間
  const formatFlightDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}小時 ${mins}分鐘`;
  };

  // 如果正在加載，顯示加載中
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ya-yellow-500"></div>
        <span className="ml-3 text-lg text-gray-700">載入航班詳情中...</span>
      </div>
    );
  }

  // 如果有錯誤，顯示錯誤信息
  if (error || !flight) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">{error || '找不到航班詳情'}</h2>
          <p className="text-gray-600 mb-8">請返回搜索頁面重新搜索航班。</p>
          <Link href="/flights" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500">
            返回航班搜索
          </Link>
        </div>
      </div>
    );
  }

  // 處理航班數據
  const airlineCode = getAirlineCode(flight.flightNumber);
  const airlineName = getAirlineName(airlineCode);
  const airlineLogo = airlineLogos[airlineCode] || airlineLogos['YA'];
  
  const departureDateTime = new Date(flight.departureTime);
  const arrivalDateTime = addMinutes(departureDateTime, flight.durationMinutes);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 頁面標題和返回按鈕 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">航班詳情</h1>
        <Link href="/flights" className="flex items-center text-ya-yellow-600 hover:text-ya-yellow-700">
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          返回搜索結果
        </Link>
      </div>
      
      {/* 航班概覽卡片 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-ya-yellow-100 rounded-md flex items-center justify-center mr-4">
                <Image
                  src={airlineLogo}
                  alt={airlineName}
                  width={40}
                  height={40}
                  className="rounded-md"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold flex items-center">
                  {flight.flightNumber}
                  <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {flight.hasStops ? `${flight.stops?.length}次中轉` : '直飛'}
                  </span>
                </h2>
                <p className="text-gray-600">{airlineName}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">航班類型</div>
              <div className="mt-1 flex items-center">
                {flight.aircraftType || "Airbus A320"}
                <span className="ml-2 w-4 h-4 bg-ya-yellow-200 rounded-full flex items-center justify-center text-ya-yellow-700 text-xs">i</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6">
            <div className="flex items-start md:items-center mb-4 md:mb-0">
              <div className="text-center">
                <div className="text-3xl font-bold">{formatTime(departureDateTime)}</div>
                <div className="text-sm text-gray-500">{formatDate(departureDateTime)}</div>
                <div className="text-lg font-medium mt-1">{flight.departureAirportCode}</div>
                <div className="text-base text-gray-600">{flight.departureAirport}</div>
              </div>
              
              <div className="mx-6 flex flex-col items-center">
                <div className="text-sm text-gray-500 mb-2">{formatFlightDuration(flight.durationMinutes)}</div>
                <div className="relative w-20 md:w-40">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300"></div>
                  <svg className="absolute right-0 top-1/2 transform -translate-y-1/2" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="7" cy="7" r="7" fill="#FFC107" />
                  </svg>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold">{formatTime(arrivalDateTime)}</div>
                <div className="text-sm text-gray-500">{formatDate(arrivalDateTime)}</div>
                <div className="text-lg font-medium mt-1">{flight.arrivalAirportCode}</div>
                <div className="text-base text-gray-600">{flight.arrivalAirport}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 票價信息 */}
        <div className="p-6 bg-gray-50">
          <h3 className="text-lg font-medium mb-4">票價信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 經濟艙 */}
            {(!flight.cabinAvailability || flight.cabinAvailability.economy) && (
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">經濟艙</h4>
                  <span className="text-ya-yellow-600 font-bold">{formatPrice(flight.prices.economy)}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <div className="flex items-center mt-1">
                    <span className="w-5 inline-block">✓</span>
                    <span>1x手提行李</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="w-5 inline-block">✓</span>
                    <span>1x託運行李</span>
                  </div>
                </div>
                <Link href={`/flights?flightId=${flight.id}&cabin=economy`} className="block mt-4 w-full py-2 px-4 bg-ya-yellow-500 hover:bg-ya-yellow-600 text-center text-black font-medium rounded-md">
                  選擇此票價
                </Link>
              </div>
            )}
            
            {/* 商務艙 */}
            {(!flight.cabinAvailability || flight.cabinAvailability.business) && (
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">商務艙</h4>
                  <span className="text-ya-yellow-600 font-bold">{formatPrice(flight.prices.business)}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <div className="flex items-center mt-1">
                    <span className="w-5 inline-block">✓</span>
                    <span>2x手提行李</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="w-5 inline-block">✓</span>
                    <span>2x託運行李</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="w-5 inline-block">✓</span>
                    <span>優先登機</span>
                  </div>
                </div>
                <Link href={`/flights?flightId=${flight.id}&cabin=business`} className="block mt-4 w-full py-2 px-4 bg-ya-yellow-500 hover:bg-ya-yellow-600 text-center text-black font-medium rounded-md">
                  選擇此票價
                </Link>
              </div>
            )}
            
            {/* 頭等艙 */}
            {(!flight.cabinAvailability || flight.cabinAvailability.first) && flight.prices.first > 0 && (
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">頭等艙</h4>
                  <span className="text-ya-yellow-600 font-bold">{formatPrice(flight.prices.first)}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <div className="flex items-center mt-1">
                    <span className="w-5 inline-block">✓</span>
                    <span>2x手提行李</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="w-5 inline-block">✓</span>
                    <span>3x託運行李</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="w-5 inline-block">✓</span>
                    <span>優先登機</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="w-5 inline-block">✓</span>
                    <span>貴賓休息室</span>
                  </div>
                </div>
                <Link href={`/flights?flightId=${flight.id}&cabin=first`} className="block mt-4 w-full py-2 px-4 bg-ya-yellow-500 hover:bg-ya-yellow-600 text-center text-black font-medium rounded-md">
                  選擇此票價
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 中轉詳情（如果有） */}
      {flight.hasStops && flight.stops && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h3 className="text-xl font-medium mb-6">航班行程詳情</h3>
            
            <div className="space-y-8">
              {/* 起點 */}
              <div className="flex">
                <div className="flex flex-col items-center mr-6">
                  <div className="w-10 h-10 rounded-full bg-ya-yellow-500 flex items-center justify-center text-white font-bold">1</div>
                  <div className="w-1 h-24 bg-gray-300 my-2"></div>
                </div>
                <div>
                  <div className="text-lg font-medium">{flight.departureAirportCode} - {flight.departureAirport}</div>
                  <div className="text-gray-600 mt-1">{formatDate(departureDateTime)}</div>
                  <div className="text-xl font-bold mt-1">{formatTime(departureDateTime)} 出發</div>
                  <div className="mt-2 text-sm text-gray-500 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <span>登機口信息將在登機前24小時公佈</span>
                  </div>
                </div>
              </div>
              
              {/* 中轉站點 */}
              {flight.stops && flight.stops.map((stop, index) => {
                // 這裡我們需要計算每個中轉點的預計到達和出發時間
                let segmentDuration = 0;
                const flightStops = flight.stops || [];
                
                for (let i = 0; i <= index; i++) {
                  if (i === index) {
                    // 從上一站到當前中轉站的飛行時間（簡化計算）
                    const flightSegmentDuration = (flight.durationMinutes - flightStops.reduce((acc, s) => acc + s.durationMinutes, 0)) / (flightStops.length + 1);
                    segmentDuration += Math.round(flightSegmentDuration);
                  } else {
                    segmentDuration += Math.round((flight.durationMinutes - flightStops.reduce((acc, s) => acc + s.durationMinutes, 0)) / (flightStops.length + 1));
                    segmentDuration += flightStops[i].durationMinutes;
                  }
                }
                
                const stopArrivalTime = addMinutes(departureDateTime, segmentDuration);
                const stopDepartureTime = addMinutes(stopArrivalTime, stop.durationMinutes);
                
                return (
                  <div key={index} className="flex">
                    <div className="flex flex-col items-center mr-6">
                      <div className="w-10 h-10 rounded-full bg-ya-yellow-200 flex items-center justify-center text-ya-yellow-800 font-bold">{index + 2}</div>
                      <div className="w-1 h-24 bg-gray-300 my-2"></div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg w-full">
                      <div className="text-lg font-medium">{stop.airportCode} - {stop.airport}</div>
                      <div className="text-gray-600 mt-1">中轉時間: {Math.floor(stop.durationMinutes / 60)}小時 {stop.durationMinutes % 60}分鐘</div>
                      <div className="mt-2 flex justify-between">
                        <div>
                          <div className="text-sm text-gray-500">到達</div>
                          <div className="text-base font-medium">{formatTime(stopArrivalTime)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">出發</div>
                          <div className="text-base font-medium">{formatTime(stopDepartureTime)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* 終點 */}
              <div className="flex">
                <div className="flex flex-col items-center mr-6">
                  <div className="w-10 h-10 rounded-full bg-ya-yellow-500 flex items-center justify-center text-white font-bold">{(flight.stops?.length || 0) + 2}</div>
                </div>
                <div>
                  <div className="text-lg font-medium">{flight.arrivalAirportCode} - {flight.arrivalAirport}</div>
                  <div className="text-gray-600 mt-1">{formatDate(arrivalDateTime)}</div>
                  <div className="text-xl font-bold mt-1">{formatTime(arrivalDateTime)} 到達</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 航班信息 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-medium mb-6">航班信息</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">基本信息</h4>
              <ul className="space-y-3">
                <li className="flex">
                  <span className="w-32 text-gray-500">航班號</span>
                  <span className="font-medium">{flight.flightNumber}</span>
                </li>
                <li className="flex">
                  <span className="w-32 text-gray-500">航空公司</span>
                  <span className="font-medium">{airlineName}</span>
                </li>
                <li className="flex">
                  <span className="w-32 text-gray-500">飛行時間</span>
                  <span className="font-medium">{formatFlightDuration(flight.durationMinutes)}</span>
                </li>
                <li className="flex">
                  <span className="w-32 text-gray-500">飛機類型</span>
                  <span className="font-medium">{flight.aircraftType || "Airbus A320"}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">行李信息</h4>
              <div className="space-y-4">
                <div>
                  <div className="text-gray-500 mb-1">經濟艙</div>
                  <ul className="list-disc list-inside text-gray-700 pl-2">
                    <li>隨身行李: 1件, 最大8公斤</li>
                    <li>託運行李: 1件, 最大23公斤</li>
                  </ul>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">商務艙</div>
                  <ul className="list-disc list-inside text-gray-700 pl-2">
                    <li>隨身行李: 2件, 每件最大8公斤</li>
                    <li>託運行李: 2件, 每件最大32公斤</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="bg-blue-50 p-4 rounded-lg text-blue-800 flex items-start">
              <InformationCircleIcon className="w-6 h-6 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium">請注意</p>
                <p className="mt-1 text-sm">所有時間均為當地時間。請在出發前至少2小時到達機場辦理登機手續。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 