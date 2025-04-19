'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { format, addMinutes } from 'date-fns';
import { Flight } from '../../types/Flight';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import FlightSelectModal from './FlightSelectModal';
import { useCurrency } from '@/app/contexts/CurrencyContext';

// 添加航空公司标识映射
const airlineLogos: Record<string, string> = {
  'YA': '/images/airlines/yellow-airlines.png', // 黃色航空
  'CA': '/images/airlines/yellow-airlines.png', // 暫時使用黃色航空標誌作為替代
  'CZ': '/images/airlines/yellow-airlines.png',
  'MU': '/images/airlines/yellow-airlines.png',
  'SQ': '/images/airlines/yellow-airlines.png',
  'CX': '/images/airlines/yellow-airlines.png',
  'JL': '/images/airlines/yellow-airlines.png',
  'KE': '/images/airlines/yellow-airlines.png'
};

// 獲取航空公司代碼
function getAirlineCode(flightNumber: string): string {
  // 提取航班號的前兩個字母作為航空公司代碼
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
    default: return 'Yellow Airlines';
  }
}

// 處理機場名稱顯示格式
const formatAirportName = (name: string, code: string): string => {
  // 檢查是否為三字代碼 + 國際機場 的格式
  if (name.startsWith(code) && name.includes('國際機場')) {
    // 嘗試從應用程序的機場數據庫獲取更好的名稱
    try {
      const { getAirportByCode } = require('@/app/lib/airports');
      const airport = getAirportByCode(code);
      if (airport && airport.name && airport.city) {
        return `${airport.city} ${airport.name}`;
      }
    } catch (error) {
      console.error('獲取機場信息失敗:', error);
    }
  }
  return name;
};

interface FlightCardProps {
  flight: Flight;
  cabinClass: 'economy' | 'business' | 'first';
  isRoundTrip?: boolean;
  returnFlight?: Flight;
}

const FlightCard = ({ flight, cabinClass, isRoundTrip = false, returnFlight }: FlightCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { formatPrice } = useCurrency();
  const [imageError, setImageError] = useState(false);
  const [cabinForModal, setCabinForModal] = useState<'economy' | 'business' | 'first'>(cabinClass);

  // 獲取航空公司代碼
  const airlineCode = getAirlineCode(flight.flightNumber);
  const airlineName = getAirlineName(airlineCode);
  const airlineLogo = airlineLogos[airlineCode] || airlineLogos['YA']; // 默認使用Yellow Airlines標誌

  // 解析航班出發時間
  const departureDateTime = new Date(flight.departureTime);
  
  // 計算到達時間
  const arrivalDateTime = addMinutes(departureDateTime, flight.durationMinutes);
  
  // 格式化時間
  const formatTime = (date: Date) => format(date, 'HH:mm');
  
  // 格式化日期
  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
  
  // 獲取艙位價格
  const price = flight.prices[cabinClass];
  
  // 格式化持續時間
  const formatFlightDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // 美化機場名稱顯示
  const displayDepartureAirport = formatAirportName(flight.departureAirport, flight.departureAirportCode);
  const displayArrivalAirport = formatAirportName(flight.arrivalAirport, flight.arrivalAirportCode);

  // 切換展開/收起
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // 打開模態窗口
  const openSelectModal = (selectedCabin?: 'economy' | 'business' | 'first') => {
    if (selectedCabin) {
      setCabinForModal(selectedCabin);
    }
    setShowModal(true);
  };

  // 關閉模態窗口
  const closeSelectModal = () => {
    setShowModal(false);
  };

  // 確認選擇
  const confirmSelection = () => {
    alert('航班預訂成功！您將很快收到確認郵件。');
    setShowModal(false);
  };

  // 根據艙位檢查是否有座位
  const isCabinAvailable = (cabin: 'economy' | 'business' | 'first'): boolean => {
    // 如果沒有cabinAvailability屬性，則默認可用
    if (!flight.cabinAvailability) return true;
    
    // 檢查指定的艙位是否可用
    return flight.cabinAvailability[cabin];
  };

  // 轉換停留時間
  const getStopInfo = () => {
    if (!flight.hasStops || !flight.stops || flight.stops.length === 0) {
      return "直飛";
    }
    return `${flight.stops.length} 停降`;
  };

  // 顯示日期差異
  const getDateDiff = () => {
    if (departureDateTime.getDate() === arrivalDateTime.getDate()) {
      return null;
    }
    
    const diffDays = Math.floor((arrivalDateTime.getTime() - departureDateTime.getTime()) / (1000 * 60 * 60 * 24));
    return `+${diffDays} 天`;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        {/* 航班主要信息 */}
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between">
            {/* 航班信息左側 */}
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-4">
                {/* 航空公司標誌 */}
                <div className="w-12 h-12 relative bg-gray-100 rounded-md flex items-center justify-center">
                  {!imageError ? (
                    <Image 
                      src={airlineLogo}
                      alt={airlineName}
                      width={48}
                      height={48}
                      className="rounded-md"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <span className="text-ya-yellow-800 font-bold text-sm">{airlineCode}</span>
                  )}
                </div>
              </div>
              <div>
                <div className="font-bold text-lg">{flight.flightNumber}</div>
                <div className="text-base text-gray-600">{airlineName}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {flight.aircraftType && (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {flight.aircraftType}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 航班時間和機場信息 */}
            <div className="flex items-center justify-between md:justify-end flex-1">
              {/* 出發時間和機場 */}
              <div className="text-center mr-6">
                <div className="text-2xl font-bold">{formatTime(departureDateTime)}</div>
                <div className="text-sm font-semibold text-gray-700">{flight.departureAirportCode}</div>
                <div className="text-xs text-gray-500 max-w-[120px] truncate">
                  {displayDepartureAirport}
                </div>
                {flight.departureTerminal && (
                  <div className="text-xs text-gray-500">航廈 {flight.departureTerminal}</div>
                )}
              </div>

              {/* 飛行時間 */}
              <div className="flex flex-col items-center mx-2">
                <div className="text-xs text-gray-500 mb-1">
                  {formatFlightDuration(flight.durationMinutes)}
                </div>
                <div className="relative w-20 md:w-28">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300"></div>
                  {flight.hasStops && flight.stops!.map((stop, index) => (
                    <div 
                      key={index} 
                      className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full" 
                      style={{ 
                        left: `${((index + 1) / (flight.stops!.length + 1)) * 100}%` 
                      }}
                    ></div>
                  ))}
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {getStopInfo()}
                </div>
              </div>

              {/* 到達時間和機場 */}
              <div className="text-center ml-6">
                <div className="text-2xl font-bold">
                  {formatTime(arrivalDateTime)}
                  {getDateDiff() && (
                    <span className="text-xs text-gray-500 font-normal ml-1">
                      {getDateDiff()}
                    </span>
                  )}
                </div>
                <div className="text-sm font-semibold text-gray-700">{flight.arrivalAirportCode}</div>
                <div className="text-xs text-gray-500 max-w-[120px] truncate">
                  {displayArrivalAirport}
                </div>
                {flight.arrivalTerminal && (
                  <div className="text-xs text-gray-500">航廈 {flight.arrivalTerminal}</div>
                )}
              </div>
            </div>
          </div>

          {/* 航班艙位選擇 */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 經濟艙 */}
            {isCabinAvailable('economy') && (
              <div 
                onClick={() => openSelectModal('economy')}
                className="border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="text-gray-700 mb-2">Economy</div>
                <div className="text-lg font-semibold">{formatPrice(flight.prices.economy)}</div>
              </div>
            )}
            
            {/* 商務艙 */}
            {isCabinAvailable('business') && (
              <div 
                onClick={() => openSelectModal('business')}
                className="border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="text-gray-700 mb-2">Business</div>
                <div className="text-lg font-semibold">{formatPrice(flight.prices.business)}</div>
              </div>
            )}
            
            {/* 頭等艙 */}
            {isCabinAvailable('first') && (
              <div 
                onClick={() => openSelectModal('first')}
                className="border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="text-gray-700 mb-2">First</div>
                <div className="text-lg font-semibold">{formatPrice(flight.prices.first)}</div>
              </div>
            )}
          </div>
        </div>
        
        {/* 中轉信息 */}
        {expanded && flight.hasStops && (
          <div className="bg-gray-50 p-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-700 mb-4">中轉詳情</h3>
            <div className="space-y-6">
              {/* 起點 */}
              <div className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700">
                    1
                  </div>
                  <div className="w-0.5 h-14 bg-gray-300 mt-1"></div>
                </div>
                <div>
                  <div className="font-medium">{displayDepartureAirport}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    出發: {formatDate(departureDateTime)} {formatTime(departureDateTime)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {flight.departureAirportCode} {flight.departureTerminal && `航廈 ${flight.departureTerminal}`}
                  </div>
                </div>
              </div>
              
              {/* 中轉站 */}
              {flight.stops!.map((stop, index) => {
                // 計算到達中轉站的時間
                let segmentDuration = 0;
                
                // 計算從起點到當前中轉站的總時間
                for (let i = 0; i <= index; i++) {
                  if (i === index) {
                    // 從上一站到當前中轉站的飛行時間（估算）
                    const flightSegmentDuration = i === 0 
                      ? (flight.durationMinutes - flight.stops!.reduce((acc, s) => acc + s.durationMinutes, 0)) / (flight.stops!.length + 1)
                      : (flight.durationMinutes - flight.stops!.reduce((acc, s) => acc + s.durationMinutes, 0)) / (flight.stops!.length + 1);
                    
                    segmentDuration += Math.round(flightSegmentDuration);
                  } else {
                    // 加上前面中轉站的飛行時間和停留時間
                    segmentDuration += Math.round((flight.durationMinutes - flight.stops!.reduce((acc, s) => acc + s.durationMinutes, 0)) / (flight.stops!.length + 1));
                    segmentDuration += flight.stops![i].durationMinutes;
                  }
                }
                
                const stopArrivalTime = addMinutes(departureDateTime, segmentDuration);
                const stopDepartureTime = addMinutes(stopArrivalTime, stop.durationMinutes);
                
                return (
                  <div key={index} className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700">
                        {index + 2}
                      </div>
                      <div className="w-0.5 h-14 bg-gray-300 mt-1"></div>
                    </div>
                    <div>
                      <div className="font-medium">{formatAirportName(stop.airport, stop.airportCode)}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        到達: {formatDate(stopArrivalTime)} {formatTime(stopArrivalTime)}
                      </div>
                      <div className="text-sm text-gray-500">
                        停留: {Math.floor(stop.durationMinutes / 60)}h {stop.durationMinutes % 60}m
                      </div>
                      <div className="text-sm text-gray-500">
                        出發: {formatDate(stopDepartureTime)} {formatTime(stopDepartureTime)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {stop.airportCode} {stop.terminal && `航廈 ${stop.terminal}`}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* 終點 */}
              <div className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700">
                    {flight.stops!.length + 2}
                  </div>
                </div>
                <div>
                  <div className="font-medium">{displayArrivalAirport}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    到達: {formatDate(arrivalDateTime)} {formatTime(arrivalDateTime)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {flight.arrivalAirportCode} {flight.arrivalTerminal && `航廈 ${flight.arrivalTerminal}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 中轉信息按鈕 */}
        {flight.hasStops ? (
          <button 
            onClick={toggleExpand}
            className="w-full py-2 bg-gray-50 text-gray-600 border-t border-gray-200 text-sm flex items-center justify-center"
          >
            {expanded ? "收起詳情" : "顯示中轉詳情"}
            {expanded ? 
              <ChevronUpIcon className="h-4 w-4 ml-1" /> : 
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            }
          </button>
        ) : (
          <div className="mt-4 flex justify-center">
            <button
              onClick={toggleExpand}
              className="inline-flex items-center text-ya-yellow-600 hover:text-ya-yellow-700"
            >
              {expanded ? (
                <>
                  收起詳情
                  <ChevronUpIcon className="w-5 h-5 ml-1" />
                </>
              ) : (
                <>
                  顯示詳情
                  <ChevronDownIcon className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </div>
        )}

        {/* 直飛航班詳情，僅當展開且沒有中轉時顯示 */}
        {expanded && !flight.hasStops && (
          <div className="bg-gray-50 p-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-700 mb-4">航班詳情</h3>
            <div className="space-y-6">
              {/* 起點 */}
              <div className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-6 h-6 rounded-full bg-ya-yellow-500 flex items-center justify-center text-xs text-white">
                    1
                  </div>
                  <div className="w-0.5 h-14 bg-gray-300 mt-1"></div>
                </div>
                <div>
                  <div className="font-medium">{displayDepartureAirport}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    出發: {formatDate(departureDateTime)} {formatTime(departureDateTime)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {flight.departureAirportCode} {flight.departureTerminal && `航廈 ${flight.departureTerminal}`}
                  </div>
                </div>
              </div>
              
              {/* 終點 */}
              <div className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-6 h-6 rounded-full bg-ya-yellow-500 flex items-center justify-center text-xs text-white">
                    2
                  </div>
                </div>
                <div>
                  <div className="font-medium">{displayArrivalAirport}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    到達: {formatDate(arrivalDateTime)} {formatTime(arrivalDateTime)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {flight.arrivalAirportCode} {flight.arrivalTerminal && `航廈 ${flight.arrivalTerminal}`}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-800 mb-3">機上服務</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-ya-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  免費餐飲
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-ya-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  機上娛樂
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-ya-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  免費Wi-Fi
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-ya-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  USB充電接口
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-800 mb-3">航班信息</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">航空公司:</span>
                  <span className="ml-2">{airlineName}</span>
                </div>
                <div>
                  <span className="text-gray-600">航班號:</span>
                  <span className="ml-2">{flight.flightNumber}</span>
                </div>
                <div>
                  <span className="text-gray-600">機型:</span>
                  <span className="ml-2">{flight.aircraftType}</span>
                </div>
                <div>
                  <span className="text-gray-600">飛行時間:</span>
                  <span className="ml-2">{formatFlightDuration(flight.durationMinutes)}</span>
                </div>
                <div>
                  <span className="text-gray-600">飛行距離:</span>
                  <span className="ml-2">{flight.distance} 公里</span>
                </div>
                <div>
                  <span className="text-gray-600">座位數:</span>
                  <span className="ml-2">{flight.seatsAvailable} 個</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 航班選擇模態窗口 */}
      {showModal && (
        <FlightSelectModal
          flight={flight}
          cabinClass={cabinForModal}
          isRoundTrip={isRoundTrip}
          returnFlight={returnFlight}
          isOpen={showModal}
          onClose={closeSelectModal}
          onConfirm={confirmSelection}
        />
      )}
    </>
  );
};

export default FlightCard; 