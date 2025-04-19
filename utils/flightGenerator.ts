import { Flight, FlightStop } from '../types/Flight';
import { addDays, format } from 'date-fns';
import { Airport, airports } from './airportsData';
import { getAirportsDistance, calculateFlightDuration, findSuitableConnectionAirports, needsConnection } from './distanceCalculator';

// 導入 app/lib/airports 中的函數，用於獲取額外的機場資訊
import { getAirportByCode as getAppAirportByCode } from '../app/lib/airports';

// 可用的飛機類型
const aircraftTypes = [
  { model: 'Boeing 737-800', shortHaul: true, longHaul: false },
  { model: 'Boeing 787-9', shortHaul: false, longHaul: true },
  { model: 'Airbus A320neo', shortHaul: true, longHaul: false },
  { model: 'Airbus A350-900', shortHaul: false, longHaul: true },
  { model: 'Boeing 777-300ER', shortHaul: false, longHaul: true },
  { model: 'Embraer E190', shortHaul: true, longHaul: false },
  { model: 'Boeing 747-8', shortHaul: false, longHaul: true },
  { model: 'Airbus A380-800', shortHaul: false, longHaul: true },
];

// 生成隨機數字
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成隨機航班號
function generateFlightNumber(isDomestic: boolean): string {
  if (isDomestic) {
    return `YA${getRandomInt(100, 9999)}`;
  }
  return `YA${getRandomInt(10, 99)}`;
}

// 選擇適當的飛機類型
function selectAircraftType(distance: number): string {
  // 根據距離選擇合適的機型
  if (distance < 2000) {
    // 短途航班
    const shortHaulAircrafts = aircraftTypes.filter(a => a.shortHaul);
    const randomIndex = Math.floor(Math.random() * shortHaulAircrafts.length);
    return shortHaulAircrafts[randomIndex].model;
  } else if (distance >= 5000) {
    // 洲際長途航班
    const longHaulAircrafts = aircraftTypes.filter(a => a.longHaul);
    const randomIndex = Math.floor(Math.random() * longHaulAircrafts.length);
    return longHaulAircrafts[randomIndex].model;
  } else {
    // 中途航班，可以使用短程或長程機型
    const suitableAircrafts = aircraftTypes.filter(a => a.shortHaul || a.longHaul);
    const randomIndex = Math.floor(Math.random() * suitableAircrafts.length);
    return suitableAircrafts[randomIndex].model;
  }
}

// 生成艙位可用性
function generateCabinAvailability(isDomestic: boolean, distance: number): { economy: boolean; business: boolean; first: boolean } {
  // 不同艙位的可用性
  let economy = true; // 經濟艙永遠可用
  let business = true; // 商務艙永遠可用 - 確保所有航班都有商務艙
  let first = false; // 頭等艙僅在部分情況可用
  
  if (isDomestic) {
    // 國內航班：經濟艙和商務艙，頭等艙稀少
    first = Math.random() > 0.8; // 只有20%的國內航班有頭等艙
  } else if (distance < 3000) {
    // 短途國際航班：很少有頭等艙
    first = Math.random() > 0.9; // 只有10%的短途國際航班有頭等艙
  } else if (distance >= 5000) {
    // 長途國際航班：始終有頭等艙
    first = true; // 確保洲際航班都有頭等艙
  } else {
    // 中途國際航班：較高機率有頭等艙
    first = Math.random() > 0.4; // 60%的中途國際航班有頭等艙
  }
  
  return { economy, business, first };
}

// 生成隨機價格
function generatePrices(isDomestic: boolean, distance: number): { economy: number; business: number; first: number } {
  let economyPrice: number;
  let businessPrice: number;
  let firstPrice: number;

  if (isDomestic) {
    economyPrice = getRandomInt(200, 800);
    businessPrice = getRandomInt(1000, 2000);
    firstPrice = businessPrice * 1.5;
  } else {
    // 國際航班，根據距離調整價格
    const distanceFactor = Math.min(distance / 1000, 10); // 最多10倍基礎價格
    economyPrice = getRandomInt(1000, 2000) * (1 + distanceFactor * 0.2);
    
    // 商務艙是經濟艙的3.5-5倍
    const businessMultiplier = getRandomInt(35, 50) / 10;
    businessPrice = economyPrice * businessMultiplier;
    
    // 頭等艙是商務艙的2-3倍
    const firstMultiplier = getRandomInt(20, 30) / 10;
    firstPrice = businessPrice * firstMultiplier;
  }

  return {
    economy: Math.round(economyPrice),
    business: Math.round(businessPrice),
    first: Math.round(firstPrice)
  };
}

// 生成隨機出發時間
function generateDepartureTime(date: string): string {
  const hours = getRandomInt(0, 23).toString().padStart(2, '0');
  const minutes = (getRandomInt(0, 11) * 5).toString().padStart(2, '0'); // 5分鐘的倍數
  return `${date}T${hours}:${minutes}:00`;
}

// 生成隨機航廈
function generateTerminal(isInternational: boolean): string {
  // 國際航班通常使用較高編號的航廈
  if (isInternational) {
    return String(getRandomInt(1, 3));
  } else {
    return String(getRandomInt(1, 2));
  }
}

// 生成中轉站
function generateStops(from: string, to: string): FlightStop[] | undefined {
  // 檢查是否需要中轉（基於距離）
  if (!needsConnection(from, to) && Math.random() > 0.3) {
    return undefined; // 70%的短途航班是直飛
  }
  
  // 為長途航班或隨機選擇的短途航班添加中轉
  // 決定中轉站數量，距離越長，中轉站越多
  const distance = getAirportsDistance(from, to);
  let numStops = 1; // 默認1個中轉站
  
  if (distance > 12000) {
    // 超長途航班，可能需要2個中轉站
    numStops = Math.random() > 0.7 ? 2 : 1;
  } else if (distance < 5000 && Math.random() > 0.8) {
    // 短途航班有少量中轉，但大多數是直飛
    return undefined;
  }
  
  // 尋找合適的中轉機場
  const connectionAirports = findSuitableConnectionAirports(from, to, numStops);
  
  if (connectionAirports.length === 0) {
    return undefined; // 如果沒有找到合適的中轉機場，則返回直飛
  }
  
  // 生成中轉信息
  const stops: FlightStop[] = connectionAirports.map(code => {
    const airport = airports.find((a: Airport) => a.code === code);
    
    if (!airport) {
      throw new Error(`找不到機場: ${code}`);
    }
    
    // 計算合理的中轉停留時間（60-180分鐘）
    const durationMinutes = getRandomInt(60, 180);
    
    return {
      airport: airport.name,
      airportCode: airport.code,
      durationMinutes,
      terminal: generateTerminal(airport.international || false)
    };
  });
  
  return stops;
}

interface GenerateFlightsOptions {
  from: string;
  to: string;
  date: string;
  cabinClass: 'economy' | 'business' | 'first';
}

export function generateFlights(options: GenerateFlightsOptions): Flight[] {
  const { from, to, date, cabinClass } = options;
  const flights: Flight[] = [];
  
  // 如果沒有提供有效的出發地或目的地，返回空數組
  if (!from || !to) {
    return [];
  }

  // 查找機場資訊
  let departureAirport = airports.find((airport: Airport) => airport.code === from);
  let arrivalAirport = airports.find((airport: Airport) => airport.code === to);
  
  // 如果找不到機場資訊，嘗試從app/lib/airports獲取
  let departureAirportName = departureAirport?.name;
  let arrivalAirportName = arrivalAirport?.name;
  
  if (!departureAirportName) {
    // 嘗試從應用程序的機場數據庫獲取
    const appDepartureAirport = getAppAirportByCode(from);
    if (appDepartureAirport) {
      departureAirportName = appDepartureAirport.name;
    } else {
      departureAirportName = `${from} 國際機場`;
    }
  }
  
  if (!arrivalAirportName) {
    // 嘗試從應用程序的機場數據庫獲取
    const appArrivalAirport = getAppAirportByCode(to);
    if (appArrivalAirport) {
      arrivalAirportName = appArrivalAirport.name;
    } else {
      arrivalAirportName = `${to} 國際機場`;
    }
  }

  // 判斷是否為國內航班
  const isDomestic = !!departureAirport && !!arrivalAirport && 
                     departureAirport.timezone === arrivalAirport.timezone &&
                     !departureAirport.international && !arrivalAirport.international;

  // 計算兩個機場之間的距離（公里）
  const distance = getAirportsDistance(from, to);

  // 確保根據艙位類型和距離生成足夠的航班，無論什麼艙位都至少有幾個選項
  const numFlights = getNumFlights(distance, cabinClass);

  // 生成航班，按照直達和中轉排序
  const directFlights: Flight[] = [];
  const connectionFlights: Flight[] = [];

  for (let i = 0; i < numFlights; i++) {
    // 生成中轉信息
    const stops = generateStops(from, to);
    const hasStops = !!stops;

    // 計算總飛行距離（考慮中轉）
    let totalDistance = distance;
    let totalStopDurationMinutes = 0;
    
    if (hasStops) {
      // 重新計算包含中轉的總距離
      totalDistance = 0;
      let currentAirport = from;
      
      for (const stop of stops) {
        // 添加到中轉站的距離
        totalDistance += getAirportsDistance(currentAirport, stop.airportCode);
        // 更新當前機場為中轉站
        currentAirport = stop.airportCode;
        // 累加中轉停留時間
        totalStopDurationMinutes += stop.durationMinutes;
      }
      
      // 添加從最後一個中轉站到目的地的距離
      totalDistance += getAirportsDistance(currentAirport, to);
    }
    
    // 計算航班飛行時間（不包括中轉停留時間）
    const flightDurationMinutes = calculateFlightDuration(totalDistance);
    
    // 生成出發時間
    const departureTime = generateDepartureTime(date);
    
    // 選擇合適的飛機類型
    const aircraftType = selectAircraftType(totalDistance);
    
    // 生成艙位可用性（基於第i個航班和請求的艙位類別）
    const cabinAvailability = generateCabinAvailabilityWithClass(isDomestic, totalDistance, cabinClass, i);
    
    // 添加航廈信息
    const departureTerminal = generateTerminal(departureAirport?.international || false);
    const arrivalTerminal = generateTerminal(arrivalAirport?.international || false);
    
    // 生成航班標識符
    const id = `${from}-${to}-${date}-${i}`;
    
    // 生成航班號
    const flightNumber = generateFlightNumber(isDomestic);
    
    // 根據距離和國內/國際航班生成價格
    const prices = generatePrices(isDomestic, totalDistance);
    
    // 該航班有頭等艙嗎？
    const hasFirstClass = cabinAvailability.first;
    
    // 生成座位數量
    const seatsAvailable = getRandomInt(5, 180);
    
    // 生成航班信息
    const flight: Flight = {
      id,
      flightNumber,
      departureAirport: departureAirportName || `${from} Airport`,
      departureAirportCode: from,
      departureTerminal,
      arrivalAirport: arrivalAirportName || `${to} Airport`,
      arrivalAirportCode: to,
      arrivalTerminal,
      departureTime,
      durationMinutes: flightDurationMinutes + totalStopDurationMinutes,
      hasStops,
      stops,
      prices,
      seatsAvailable,
      distance: Math.round(totalDistance),
      aircraftType,
      hasFirstClass,
      cabinAvailability
    };
    
    // 根據是否為直達航班將其添加到相應數組中
    if (hasStops) {
      connectionFlights.push(flight);
    } else {
      directFlights.push(flight);
    }
  }

  // 將直達航班放在前面，中轉航班放在後面
  return [...directFlights, ...connectionFlights];
}

// 根據艙位和距離決定生成的航班數量
function getNumFlights(distance: number, cabinClass: string): number {
  let baseNumFlights: number;
  
  if (distance < 1500) {
    baseNumFlights = getRandomInt(6, 15); // 短途航班較多
  } else if (distance < 5000) {
    baseNumFlights = getRandomInt(4, 10); // 中途航班
  } else {
    baseNumFlights = getRandomInt(2, 6); // 長途航班較少
  }
  
  // 為商務艙和頭等艙增加額外的航班數量
  if (cabinClass === 'business') {
    baseNumFlights = Math.max(baseNumFlights, 5); // 確保商務艙至少有5個選項
  } else if (cabinClass === 'first') {
    baseNumFlights = Math.max(baseNumFlights, 3); // 確保頭等艙至少有3個選項
  }
  
  return baseNumFlights;
}

// 基於艙位類型生成艙位可用性
function generateCabinAvailabilityWithClass(isDomestic: boolean, distance: number, requestedClass: string, flightIndex: number): { economy: boolean; business: boolean; first: boolean } {
  // 默認值
  let economy = true; // 經濟艙永遠可用
  let business = true; // 商務艙在長途航班上通常可用
  let first = false; // 頭等艙在短途航班上通常不可用
  
  // 根據請求的艙位強制確保該艙位始終可用
  // 無論什麼情況，至少確保最初的10個航班都有請求的艙位可用
  if (requestedClass === 'business') {
    // 商務艙必定可用
    business = true;
    
    // 對於長途航班，增加頭等艙可用性
    if (distance >= 5000) {
      first = flightIndex % 3 === 0; // 每三個航班中提供一個頭等艙選項
    } else if (distance >= 3000) {
      first = flightIndex % 5 === 0; // 每五個航班中提供一個頭等艙選項
    } else {
      first = flightIndex % 10 === 0; // 短途航班很少有頭等艙
    }
  } else if (requestedClass === 'first') {
    // 頭等艙必定可用
    first = true;
    business = true; // 如果有頭等艙，則必定有商務艙
  } else {
    // 經濟艙搜索時
    if (isDomestic) {
      business = true;
      first = flightIndex % 5 === 0; // 每五個國內航班中提供一個頭等艙選項
    } else if (distance < 3000) {
      business = true;
      first = flightIndex % 8 === 0; // 短途國際航班很少有頭等艙
    } else if (distance >= 5000) {
      business = true;
      first = flightIndex % 2 === 0; // 長途國際航班有較多頭等艙選項
    } else {
      business = true;
      first = flightIndex % 4 === 0; // 中途國際航班有一些頭等艙選項
    }
  }
  
  return { economy, business, first };
}

// 生成所有機場之間的航班數據（用於批量生成數據文件）
export function generateAllFlights(): Flight[] {
  const allFlights: Flight[] = [];
  const today = new Date();

  // 生成未來7天的航班
  for (let day = 0; day < 7; day++) {
    const date = format(addDays(today, day), 'yyyy-MM-dd');

    // 從廣州出發到所有主要目的地
    const origin = 'CAN';
    
    // 選擇主要國際機場作為目的地
    const destinations = airports
      .filter(airport => airport.international && airport.code !== origin)
      .map(airport => airport.code);
    
    // 對每個目的地生成航班
    for (const destination of destinations) {
      const flights = generateFlights({
        from: origin,
        to: destination,
        date,
        cabinClass: 'economy'
      });
      
      allFlights.push(...flights);
    }
  }

  return allFlights;
} 