import { Flight } from '../types/Flight';

interface FlightCacheKey {
  from: string;
  to: string;
  date: string;
  cabinClass: string;
}

// 存儲航班數據的快取
const flightCache = new Map<string, Flight[]>();

// 創建快取鍵
function createCacheKey(from: string, to: string, date: string, cabinClass: string): string {
  return `${from}-${to}-${date}-${cabinClass}`;
}

// 從快取中獲取航班數據
export function getCachedFlights(from: string, to: string, date: string, cabinClass: string = 'economy'): Flight[] | null {
  const cacheKey = createCacheKey(from, to, date, cabinClass);
  return flightCache.has(cacheKey) ? flightCache.get(cacheKey)! : null;
}

// 將航班數據保存到快取中
export function cacheFlights(from: string, to: string, date: string, flights: Flight[], cabinClass: string = 'economy'): void {
  const cacheKey = createCacheKey(from, to, date, cabinClass);
  flightCache.set(cacheKey, flights);
  
  // 為避免內存洩漏，限制快取大小，當快取鍵超過100個時，清除最舊的條目
  if (flightCache.size > 100) {
    const oldestKey = flightCache.keys().next().value;
    if (oldestKey !== undefined) {
      flightCache.delete(oldestKey);
    }
  }
}

// 清除所有快取
export function clearFlightCache(): void {
  flightCache.clear();
} 