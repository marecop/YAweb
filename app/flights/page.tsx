'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import FlightSearchForm from '../components/FlightSearchForm';
import FlightCard from '../components/FlightCard';
import FlightFilter from '../components/FlightFilter';
import { sampleFlights } from '../../utils/flightData';
import { Flight } from '../../types/Flight';
import { getCachedFlights, cacheFlights } from '../../utils/flightCache';
import { generateFlights } from '../../utils/flightGenerator';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import CurrencySelector from '@/app/components/CurrencySelector';
import Image from 'next/image';
import { FaPlane, FaExchangeAlt, FaSuitcase, FaWifi, FaUtensils, FaTicketAlt } from 'react-icons/fa';
import { BsStar, BsStarFill } from 'react-icons/bs';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

const FlightsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [returnFlights, setReturnFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [filteredReturnFlights, setFilteredReturnFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('departureTime');
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [selectedOutboundFlight, setSelectedOutboundFlight] = useState<Flight | null>(null);
  const [showReturnFlights, setShowReturnFlights] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    directOnly: false,
    maxPrice: 10000,
    departureTimeRange: [0, 24] as [number, number],
    airline: 'all'
  });

  const { formatPrice } = useCurrency();

  useEffect(() => {
    // 重置所有狀態
    setLoading(true);
    setSelectedOutboundFlight(null);
    setShowReturnFlights(false);
    
    // 從 URL 參數獲取搜索條件
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const departDate = searchParams.get('departDate') || '';
    const returnDate = searchParams.get('returnDate') || '';
    const cabinClass = searchParams.get('cabinClass') || 'economy';
    const tripType = searchParams.get('tripType') || 'oneway';
    
    // 首先檢查快取中是否有去程數據，並包含艙等參數
    const cachedFlights = getCachedFlights(from, to, departDate, cabinClass);
    
    if (cachedFlights) {
      console.log('使用快取的去程航班數據');
      setFlights(cachedFlights);
      setFilteredFlights(cachedFlights);
      
      // 如果是來回行程且有返回日期
      if (tripType === 'roundtrip' && returnDate) {
        // 檢查快取中是否有回程數據，並包含艙等參數
        const cachedReturnFlights = getCachedFlights(to, from, returnDate, cabinClass);
        
        if (cachedReturnFlights) {
          console.log('使用快取的回程航班數據');
          setReturnFlights(cachedReturnFlights);
          setFilteredReturnFlights(cachedReturnFlights);
        } else {
          console.log('生成新的回程航班數據');
          
          // 生成回程航班數據
          let returnFlightsData = generateFlights({
            from: to || '',
            to: from || 'TPE',
            date: returnDate,
            cabinClass: cabinClass as 'economy' | 'business' | 'first'
          });
          
          // 將生成的回程航班數據保存到快取中
          if (returnFlightsData.length > 0 && from && to) {
            cacheFlights(to, from, returnDate, returnFlightsData, cabinClass);
          }
          
          setReturnFlights(returnFlightsData);
          setFilteredReturnFlights(returnFlightsData);
        }
      }
      
      setLoading(false);
    } else {
      // 如果沒有快取，則嘗試從預設數據中篩選或生成新數據
      console.log('生成新的去程航班數據');
      
      // 使用延遲來模擬API請求
      setTimeout(() => {
        let outboundFlightsData: Flight[] = [];
        
        // 如果沒有搜索條件或只有出發地是台北，則使用示例數據
        if ((!from && !to) || (from === 'TPE' && !to)) {
          outboundFlightsData = [...sampleFlights];
        } 
        // 否則根據搜索條件生成新的航班數據
        else {
          // 優先使用預設數據中符合條件的航班
          const filteredData = sampleFlights.filter(flight => {
            const fromMatch = !from || flight.departureAirportCode === from;
            const toMatch = !to || flight.arrivalAirportCode === to;
            // 增加艙等的考慮
            const cabinMatch = !flight.cabinAvailability || 
                              flight.cabinAvailability[cabinClass as keyof typeof flight.cabinAvailability];
            return fromMatch && toMatch && cabinMatch;
          });
          
          if (filteredData.length > 0) {
            outboundFlightsData = filteredData;
          } else {
            // 如果預設數據中沒有符合條件的航班，則生成新的航班數據
            outboundFlightsData = generateFlights({
              from: from || 'TPE', // 如果沒有指定出發地，默認使用台北
              to: to || '',
              date: departDate || new Date().toISOString().split('T')[0],
              cabinClass: cabinClass as 'economy' | 'business' | 'first'
            });
            
            // 將生成的航班數據保存到快取中
            if (outboundFlightsData.length > 0 && from && to) {
              cacheFlights(from, to, departDate, outboundFlightsData, cabinClass);
            }
          }
        }
        
        setFlights(outboundFlightsData);
        setFilteredFlights(outboundFlightsData);
        
        // 如果是來回行程且有返回日期，獲取回程航班
        if (tripType === 'roundtrip' && returnDate) {
          // 檢查快取中是否有回程數據
          const cachedReturnFlights = getCachedFlights(to, from, returnDate, cabinClass);
          
          if (cachedReturnFlights) {
            console.log('使用快取的回程航班數據');
            setReturnFlights(cachedReturnFlights);
            setFilteredReturnFlights(cachedReturnFlights);
          } else {
            console.log('生成新的回程航班數據');
            
            // 生成回程航班數據
            let returnFlightsData = generateFlights({
              from: to || '',
              to: from || 'TPE',
              date: returnDate,
              cabinClass: cabinClass as 'economy' | 'business' | 'first'
            });
            
            // 將生成的回程航班數據保存到快取中
            if (returnFlightsData.length > 0 && from && to) {
              cacheFlights(to, from, returnDate, returnFlightsData, cabinClass);
            }
            
            setReturnFlights(returnFlightsData);
            setFilteredReturnFlights(returnFlightsData);
          }
        }
        
        setLoading(false);
      }, 1500);
    }
  }, [searchParams]);

  useEffect(() => {
    // 應用過濾條件到去程航班
    applyFilters(flights, setFilteredFlights);
    
    // 如果有回程航班，也應用過濾條件
    if (returnFlights.length > 0) {
      applyFilters(returnFlights, setFilteredReturnFlights);
    }
  }, [flights, returnFlights, filterOptions, sortBy, searchParams]);

  // 應用過濾器和排序
  const applyFilters = (flightList: Flight[], setFilteredList: React.Dispatch<React.SetStateAction<Flight[]>>) => {
    let results = [...flightList];
    
    // 直飛過濾
    if (filterOptions.directOnly) {
      results = results.filter(flight => !flight.hasStops);
    }
    
    // 移除艙位可用性過濾，顯示所有航班
    
    // 價格過濾 - 使用經濟艙價格作為基準
    results = results.filter(flight => {
      return flight.prices.economy <= filterOptions.maxPrice;
    });
    
    // 起飛時間過濾
    results = results.filter(flight => {
      const departureHour = new Date(flight.departureTime).getHours();
      return departureHour >= filterOptions.departureTimeRange[0] && 
             departureHour <= filterOptions.departureTimeRange[1];
    });
    
    // 航空公司過濾
    if (filterOptions.airline !== 'all') {
      results = results.filter(flight => flight.flightNumber.startsWith(filterOptions.airline));
    }
    
    // 排序 - 使用經濟艙價格作為基準
    results.sort((a, b) => {
      switch(sortBy) {
        case 'price':
          return a.prices.economy - b.prices.economy;
        case 'duration':
          return a.durationMinutes - b.durationMinutes;
        case 'departureTime':
        default:
          return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
      }
    });
    
    setFilteredList(results);
  };

  const handleFilterChange = (newFilterOptions: typeof filterOptions) => {
    setFilterOptions(newFilterOptions);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  // 處理修改搜索的邏輯
  const handleSearchToggle = () => {
    setShowSearchForm(!showSearchForm);
  };

  // 處理選擇去程航班
  const handleSelectOutboundFlight = (flight: Flight) => {
    setSelectedOutboundFlight(flight);
    setShowReturnFlights(true);
    
    // 滾動到頁面頂部以顯示回程航班
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const departDate = searchParams.get('departDate') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const cabinClass = searchParams.get('cabinClass') || 'economy';
  const tripType = searchParams.get('tripType') || 'oneway';
  const isRoundTrip = tripType === 'roundtrip';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">航班搜索結果</h1>
      
      {/* 搜索摘要 */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="flex flex-wrap items-center justify-between">
          <div className="mb-2 md:mb-0">
            <span className="font-bold">{from || '任意出發地'}</span>
            <span className="mx-2">→</span>
            <span className="font-bold">{to || '任意目的地'}</span>
            <span className="ml-4 text-gray-600">
              {departDate || '任意日期'} 
              {isRoundTrip && returnDate && ` - ${returnDate}`}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {/* 移除艙位信息標籤，現在會顯示所有艙位 */}
              {isRoundTrip && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  來回行程
                </span>
              )}
            </div>
            <CurrencySelector />
          </div>
        </div>
        <div className="mt-4">
          <button 
            className="text-ya-yellow-600 hover:text-ya-yellow-700 flex items-center"
            onClick={handleSearchToggle}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            {showSearchForm ? '隱藏搜索' : '修改搜索'}
          </button>
        </div>
        {showSearchForm && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <FlightSearchForm 
              initialValues={{
                from: from || '',
                to: to || '',
                departDate: departDate || '',
                returnDate: returnDate || '',
                tripType: tripType as 'oneway' | 'roundtrip'
              } as any}
            />
          </div>
        )}
      </div>
      
      {/* 來回行程顯示區 */}
      {isRoundTrip && (
        <div className="mb-8">
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-md ${!showReturnFlights ? 'bg-ya-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setShowReturnFlights(false)}
            >
              去程航班
            </button>
            <button
              className={`px-4 py-2 rounded-md ${showReturnFlights ? 'bg-ya-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setShowReturnFlights(true)}
              disabled={selectedOutboundFlight === null && !showReturnFlights}
            >
              回程航班
            </button>
          </div>
          
          {selectedOutboundFlight && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-ya-yellow-200">
              <h3 className="font-medium text-gray-700">已選擇的{showReturnFlights ? '去程' : '回程'}航班</h3>
              <div className="mt-2 flex justify-between items-center">
                <div>
                  <div className="font-bold">
                    {selectedOutboundFlight.flightNumber} - {showReturnFlights ? '去程' : '回程'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedOutboundFlight.departureAirportCode} → {selectedOutboundFlight.arrivalAirportCode} | 
                    {new Date(selectedOutboundFlight.departureTime).toLocaleDateString()} | 
                    {formatPrice(selectedOutboundFlight.prices.economy)}
                  </div>
                </div>
                {showReturnFlights && (
                  <button
                    className="text-red-600 hover:text-red-800 text-sm"
                    onClick={() => {
                      setSelectedOutboundFlight(null);
                      setShowReturnFlights(false);
                    }}
                  >
                    取消選擇
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 過濾面板 */}
        <div className="lg:w-1/4">
          <FlightFilter 
            onFilterChange={handleFilterChange}
            initialFilters={filterOptions}
            maxPrice={10000}
          />
        </div>
        
        {/* 航班列表 */}
        <div className="lg:w-3/4">
          {/* 排序選項 */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-600">
                  找到 {showReturnFlights ? filteredReturnFlights.length : filteredFlights.length} 個
                  {showReturnFlights ? '回程' : '去程'}航班
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-gray-600">排序:</span>
                <select 
                  className="select-field w-auto"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="departureTime">出發時間</option>
                  <option value="price">價格</option>
                  <option value="duration">飛行時間</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* 載入中 */}
          {loading && (
            <div className="bg-white p-16 rounded-lg shadow-md flex justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 bg-ya-yellow-200 rounded-full mb-4"></div>
                <div className="text-gray-600">正在搜索最佳航班...</div>
              </div>
            </div>
          )}
          
          {/* 航班列表 - 無結果 */}
          {!loading && 
            ((showReturnFlights && filteredReturnFlights.length === 0) || 
            (!showReturnFlights && filteredFlights.length === 0)) && (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-xl text-gray-600">沒有找到符合條件的航班</div>
              <p className="mt-4 text-gray-500">請嘗試修改您的搜索條件</p>
            </div>
          )}
          
          {/* 去程航班列表 */}
          {!loading && !showReturnFlights && filteredFlights.length > 0 && (
            <div className="space-y-4">
              {filteredFlights.map((flight) => (
                <div key={flight.id} onClick={() => isRoundTrip && handleSelectOutboundFlight(flight)}>
                  <FlightCard
                    flight={flight}
                    cabinClass="economy"
                    isRoundTrip={false}
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* 回程航班列表 */}
          {!loading && showReturnFlights && filteredReturnFlights.length > 0 && (
            <div className="space-y-4">
              {filteredReturnFlights.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  cabinClass="economy"
                  isRoundTrip={true}
                  returnFlight={selectedOutboundFlight || undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightsPage; 