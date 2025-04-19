import { Airport, airports } from './airportsData';

// 地球半徑（公里）
const EARTH_RADIUS = 6371;

// 將角度轉為弧度
export const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// 使用哈弗辛公式計算兩點間的距離（公里）
export const calculateDistance = (
  fromLat: number, 
  fromLng: number, 
  toLat: number, 
  toLng: number
): number => {
  const dLat = deg2rad(toLat - fromLat);
  const dLon = deg2rad(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(fromLat)) * Math.cos(deg2rad(toLat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS * c;
  return Math.round(distance);
};

// 計算兩個機場之間的距離
export const getAirportsDistance = (fromCode: string, toCode: string): number => {
  const fromAirport = airports.find((a: Airport) => a.code === fromCode);
  const toAirport = airports.find((a: Airport) => a.code === toCode);
  
  if (!fromAirport || !toAirport) {
    return 0;
  }
  
  return calculateDistance(
    fromAirport.location.lat, 
    fromAirport.location.lng, 
    toAirport.location.lat, 
    toAirport.location.lng
  );
};

/**
 * 計算飛行時間（分鐘）
 * 
 * 基於實際航空旅行的一般速度：
 * - 短途航班（<1500公里）：平均速度約500-550公里/小時，需要額外起降時間
 * - 中途航班（1500-5000公里）：平均速度約700-800公里/小時
 * - 長途航班（>5000公里）：平均速度約800-900公里/小時
 */
export const calculateFlightDuration = (distanceKm: number): number => {
  // 起飛和降落所需的額外時間（分鐘）
  const takeoffLandingTime = 40;
  
  let durationMinutes: number;
  
  if (distanceKm < 1500) {
    // 短途航班：較低的巡航速度
    const cruiseSpeed = 500; // 公里/小時
    durationMinutes = Math.round((distanceKm / cruiseSpeed) * 60) + takeoffLandingTime;
  } else if (distanceKm < 5000) {
    // 中途航班：中等巡航速度
    const cruiseSpeed = 750; // 公里/小時
    durationMinutes = Math.round((distanceKm / cruiseSpeed) * 60) + takeoffLandingTime;
  } else {
    // 長途航班：較高的巡航速度
    const cruiseSpeed = 850; // 公里/小時
    durationMinutes = Math.round((distanceKm / cruiseSpeed) * 60) + takeoffLandingTime;
  }
  
  // 為長途航班添加額外時間（如空中等待、繞行等）
  if (distanceKm > 8000) {
    durationMinutes += 30;
  }
  
  return durationMinutes;
};

// 判斷兩個機場是否需要中轉（根據距離）
export const needsConnection = (fromCode: string, toCode: string): boolean => {
  const distance = getAirportsDistance(fromCode, toCode);
  // 距離超過10000公里的航班通常需要中轉
  return distance > 10000;
};

// 定義中轉機場評分接口
interface ConnectionScore {
  code: string;
  name: string;
  distanceViaConnection: number;
  efficiency: number;
  isReasonableDirection: boolean;
  score: number;
}

// 尋找適合的中轉機場
export const findSuitableConnectionAirports = (fromCode: string, toCode: string, count: number = 1): string[] => {
  const fromAirport = airports.find((a: Airport) => a.code === fromCode);
  const toAirport = airports.find((a: Airport) => a.code === toCode);
  
  if (!fromAirport || !toAirport) {
    return [];
  }
  
  // 計算直線距離
  const directDistance = getAirportsDistance(fromCode, toCode);
  
  // 為每個可能的中轉機場計算總路線距離
  const connectionsWithScore = airports
    .filter((airport: Airport) => airport.code !== fromCode && airport.code !== toCode)
    .map((airport: Airport) => {
      // 計算經過此機場的總距離
      const distanceViaConnection = 
        getAirportsDistance(fromCode, airport.code) + 
        getAirportsDistance(airport.code, toCode);
      
      // 計算中轉效率（總路線距離與直線距離的比率）
      // 較低的比率意味著更有效的中轉
      const efficiency = distanceViaConnection / directDistance;
      
      // 檢查這個中轉機場是否在合理的方向上
      // 避免完全背離目的地的中轉
      const isReasonableDirection = efficiency < 1.3;
      
      // 計算地理位置適合度（機場是否大致位於出發地和目的地之間）
      const midLat = (fromAirport.location.lat + toAirport.location.lat) / 2;
      const midLng = (fromAirport.location.lng + toAirport.location.lng) / 2;
      
      const distanceFromMidpoint = calculateDistance(
        airport.location.lat,
        airport.location.lng,
        midLat,
        midLng
      );
      
      // 計算整體分數（較低的分數更好）
      const score = efficiency * 0.7 + (distanceFromMidpoint / 1000) * 0.3;
      
      return {
        code: airport.code,
        name: airport.name,
        distanceViaConnection,
        efficiency,
        isReasonableDirection,
        score
      } as ConnectionScore;
    })
    .filter((conn: ConnectionScore) => conn.isReasonableDirection)
    .sort((a: ConnectionScore, b: ConnectionScore) => a.score - b.score);
  
  // 返回前N個最適合的中轉機場
  return connectionsWithScore.slice(0, count).map((conn: ConnectionScore) => conn.code);
}; 