'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AirportSearchInput from './AirportSearchInput';
import { calculateDistance, getAirportByCode } from '@/app/lib/airports';

// 定義表單初始值的介面
export interface FlightSearchFormProps {
  initialValues?: {
    from: string;
    to: string;
    departDate: string;
    returnDate?: string;
    tripType?: 'oneway' | 'roundtrip';
    passengers?: number;
  };
}

// 定義行程類型
type TripType = 'oneway' | 'roundtrip';

// 機場列表示例
const airports = [
  { code: 'TPE', name: '台北桃園國際機場', location: { lat: 25.0797, lng: 121.2342 } },
  { code: 'TSA', name: '台北松山機場', location: { lat: 25.0694, lng: 121.5521 } },
  { code: 'KHH', name: '高雄國際機場', location: { lat: 22.5771, lng: 120.3504 } },
  { code: 'HKG', name: '香港國際機場', location: { lat: 22.3080, lng: 113.9185 } },
  { code: 'NRT', name: '東京成田國際機場', location: { lat: 35.7720, lng: 140.3929 } },
  { code: 'HND', name: '東京羽田機場', location: { lat: 35.5494, lng: 139.7798 } },
  { code: 'ICN', name: '首爾仁川國際機場', location: { lat: 37.4602, lng: 126.4407 } },
  { code: 'BKK', name: '曼谷素萬那普國際機場', location: { lat: 13.6900, lng: 100.7501 } },
  { code: 'SIN', name: '新加坡樟宜機場', location: { lat: 1.3644, lng: 103.9915 } },
  { code: 'PVG', name: '上海浦東國際機場', location: { lat: 31.1443, lng: 121.8083 } },
  { code: 'PEK', name: '北京首都國際機場', location: { lat: 40.0799, lng: 116.6031 } },
  { code: 'CAN', name: '廣州白雲國際機場', location: { lat: 23.3959, lng: 113.3080 } },
  { code: 'SYD', name: '悉尼國際機場', location: { lat: -33.9399, lng: 151.1753 } },
  { code: 'LAX', name: '洛杉磯國際機場', location: { lat: 33.9416, lng: -118.4085 } },
  { code: 'JFK', name: '紐約甘迺迪國際機場', location: { lat: 40.6413, lng: -73.7781 } },
  { code: 'LHR', name: '倫敦希思羅機場', location: { lat: 51.4700, lng: -0.4543 } },
  { code: 'CDG', name: '巴黎戴高樂機場', location: { lat: 49.0097, lng: 2.5479 } },
  { code: 'FRA', name: '法蘭克福國際機場', location: { lat: 50.0379, lng: 8.5622 } },
  { code: 'DXB', name: '杜拜國際機場', location: { lat: 25.2532, lng: 55.3657 } },
  { code: 'YYZ', name: '多倫多皮爾遜國際機場', location: { lat: 43.6777, lng: -79.6248 } }
];

const FlightSearchForm = ({ initialValues }: FlightSearchFormProps) => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    from: initialValues?.from || '',
    to: initialValues?.to || '',
    departDate: initialValues?.departDate || '',
    returnDate: initialValues?.returnDate || '',
    tripType: initialValues?.tripType || 'oneway' as TripType,
    passengers: initialValues?.passengers || 1
  });

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  // 頁面載入時自動設置廣州為默認出發地
  useEffect(() => {
    if (!initialValues?.from) {
      setFormData(prev => ({
        ...prev,
        from: 'CAN'
      }));
    }
  }, [initialValues]);

  // 設置最小日期為今天
  const today = new Date().toISOString().split('T')[0];
  
  // 根據出發日期計算返回日期的最小值
  const minReturnDate = formData.departDate || today;

  // 根據用戶位置獲取最近的機場
  const detectUserLocation = async () => {
    setIsLocating(true);
    setLocationError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          // 導入機場數據
          const { airports, calculateDistance } = await import('@/app/lib/airports');
          
          // 計算用戶與各機場的距離
          const airportsWithDistance = airports.map(airport => {
            const distance = calculateDistance(
              userLat, 
              userLng, 
              airport.location.lat, 
              airport.location.lng
            );
            return { ...airport, distance };
          });
          
          // 按距離排序並選擇最近的機場
          airportsWithDistance.sort((a, b) => a.distance - b.distance);
          const nearestAirport = airportsWithDistance[0];
          
          setFormData(prev => ({
            ...prev,
            from: nearestAirport.code
          }));
          
          setIsLocating(false);
        },
        (error) => {
          setIsLocating(false);
          // 當定位失敗時，默認使用廣州機場
          setFormData(prev => ({
            ...prev,
            from: 'CAN'
          }));
          switch(error.code) {
            case error.PERMISSION_DENIED:
              setLocationError('用戶拒絕了位置請求，已設置為廣州出發');
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError('位置信息不可用，已設置為廣州出發');
              break;
            case error.TIMEOUT:
              setLocationError('請求超時，已設置為廣州出發');
              break;
            default:
              setLocationError('發生未知錯誤，已設置為廣州出發');
              break;
          }
        },
        { 
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setIsLocating(false);
      setLocationError('您的瀏覽器不支持地理定位，已設置為廣州出發');
      // 當瀏覽器不支持定位時，默認使用廣州機場
      setFormData(prev => ({
        ...prev,
        from: 'CAN'
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 交換出發地和目的地
  const handleSwapLocations = () => {
    setFormData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  // 處理行程類型切換
  const handleTripTypeChange = (type: TripType) => {
    setFormData(prev => ({
      ...prev,
      tripType: type,
      // 如果切換到單程，清空返回日期
      returnDate: type === 'oneway' ? '' : prev.returnDate
    }));
  };

  // 處理旅客數量變更
  const handlePassengerChange = (change: number) => {
    const newCount = Math.max(1, Math.min(10, formData.passengers + change));
    setFormData(prev => ({
      ...prev,
      passengers: newCount
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 構建查詢參數
    const params = new URLSearchParams();
    if (formData.from) params.append('from', formData.from);
    if (formData.to) params.append('to', formData.to);
    if (formData.departDate) params.append('departDate', formData.departDate);
    if (formData.tripType === 'roundtrip' && formData.returnDate) {
      params.append('returnDate', formData.returnDate);
    }
    // 移除艙位參數，默認使用economy
    params.append('cabinClass', 'economy');
    params.append('tripType', formData.tripType);
    params.append('passengers', formData.passengers.toString());
    
    // 跳轉到航班搜索結果頁面
    router.push(`/flights?${params.toString()}`);
  };

  return (
    <div className="relative">
      {/* 移除登入入口 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 行程類型切換 */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <input
              id="oneway"
              name="tripType"
              type="radio"
              checked={formData.tripType === 'oneway'}
              onChange={() => handleTripTypeChange('oneway')}
              className="h-4 w-4 text-ya-yellow-600 focus:ring-ya-yellow-500 border-gray-300"
            />
            <label htmlFor="oneway" className="ml-2 block text-sm text-gray-700">
              單程
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="roundtrip"
              name="tripType"
              type="radio"
              checked={formData.tripType === 'roundtrip'}
              onChange={() => handleTripTypeChange('roundtrip')}
              className="h-4 w-4 text-ya-yellow-600 focus:ring-ya-yellow-500 border-gray-300"
            />
            <label htmlFor="roundtrip" className="ml-2 block text-sm text-gray-700">
              來回
            </label>
          </div>
        </div>

        {/* 出發地和目的地 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          <AirportSearchInput
            id="from"
            name="from"
            label="出發地"
            value={formData.from}
            onChange={(code) => setFormData(prev => ({ ...prev, from: code }))}
            placeholder="輸入城市或機場"
            required
            showLocationButton={true}
            onLocationRequest={detectUserLocation}
            isLocating={isLocating}
          />

          {/* 交換按鈕 */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
            <button
              type="button"
              onClick={handleSwapLocations}
              className="bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50"
              title="交換出發地和目的地"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
            </button>
          </div>

          <AirportSearchInput
            id="to"
            name="to"
            label="目的地"
            value={formData.to}
            onChange={(code) => setFormData(prev => ({ ...prev, to: code }))}
            placeholder="輸入城市或機場"
            required
          />
        </div>
        
        {locationError && (
          <p className="mt-1 text-sm text-yellow-600">{locationError}</p>
        )}

        {/* 日期和其他選項 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 出發日期 */}
          <div>
            <label htmlFor="departDate" className="block text-sm font-medium text-gray-700 mb-1">
              出發日期
            </label>
            <input
              id="departDate"
              name="departDate"
              type="date"
              required
              min={today}
              value={formData.departDate}
              onChange={handleChange}
              className="py-3 px-4 w-full border border-gray-300 rounded-md shadow-sm focus:border-ya-yellow-500 focus:ring-ya-yellow-500"
            />
          </div>

          {/* 返回日期（只在來回行程時顯示） */}
          {formData.tripType === 'roundtrip' && (
            <div>
              <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
                返回日期
              </label>
              <input
                id="returnDate"
                name="returnDate"
                type="date"
                required
                min={minReturnDate}
                value={formData.returnDate}
                onChange={handleChange}
                className="py-3 px-4 w-full border border-gray-300 rounded-md shadow-sm focus:border-ya-yellow-500 focus:ring-ya-yellow-500"
              />
            </div>
          )}

          {/* 旅客數量 - 調整布局以填滿移除艙等選擇後的空間 */}
          <div className={formData.tripType === 'roundtrip' ? 'md:col-span-2' : ''}>
            <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
              旅客人數
            </label>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => handlePassengerChange(-1)}
                disabled={formData.passengers <= 1}
                className="px-3 py-3 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                </svg>
              </button>
              <input
                id="passengers"
                name="passengers"
                type="number"
                min="1"
                max="10"
                value={formData.passengers}
                onChange={handleChange}
                className="w-full py-3 px-4 text-center focus:border-ya-yellow-500 focus:ring-ya-yellow-500 border-0"
              />
              <button
                type="button"
                onClick={() => handlePassengerChange(1)}
                disabled={formData.passengers >= 10}
                className="px-3 py-3 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-black bg-ya-yellow-500 hover:bg-ya-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500"
        >
          搜索航班
        </button>
      </form>
    </div>
  );
};

export default FlightSearchForm; 