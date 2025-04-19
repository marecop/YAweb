import { Flight } from '../types/Flight';

// 可用的機型
const aircraftTypes = {
  // 空中客車 (Airbus)
  shortHaul: ['A220-200', 'A319neo', 'A320-200', 'A320neo', 'A321neo'],
  mediumHaul: ['A330-300', 'A330-900'],
  longHaul: ['A350-900', 'A350-1000', 'A380-800'],
  
  // 波音 (Boeing)
  shortHaulBoeing: ['737-800', '737 MAX 8', '737 MAX 9'],
  mediumHaulBoeing: ['787-8'],
  longHaulBoeing: ['777-300ER', '787-9', '787-10', '747-8i'],
  
  // 小型機
  regional: ['Embraer E190', 'Bombardier CRJ900']
};

// 與頭等艙配置的長程機型
const firstClassAircrafts = ['A380-800', 'A350-900', 'A350-1000', '777-300ER', '787-9', '787-10', '747-8i'];

// 根據航程和航線選擇機型
function selectAircraftType(flight: Flight): string {
  // 國際長途航班
  if (flight.durationMinutes >= 480) { // 8小時以上
    const isPopularRoute = flight.arrivalAirportCode === 'JFK' || 
                          flight.arrivalAirportCode === 'LHR' || 
                          flight.arrivalAirportCode === 'SYD';
    
    // 熱門長途航線可能使用A380
    if (isPopularRoute && Math.random() < 0.3) {
      return 'A380-800';
    }
    
    // 其他長途航線隨機選擇長途機型
    const longHaulOptions = [...aircraftTypes.longHaul, ...aircraftTypes.longHaulBoeing];
    return longHaulOptions[Math.floor(Math.random() * longHaulOptions.length)];
  } 
  // 中等距離航班 (4-8小時)
  else if (flight.durationMinutes >= 240) {
    const mediumHaulOptions = [...aircraftTypes.mediumHaul, ...aircraftTypes.mediumHaulBoeing];
    return mediumHaulOptions[Math.floor(Math.random() * mediumHaulOptions.length)];
  } 
  // 短途國際航班 (2-4小時)
  else if (flight.durationMinutes >= 120) {
    if (Math.random() < 0.7) {
      // 多數使用空客
      return aircraftTypes.shortHaul[Math.floor(Math.random() * aircraftTypes.shortHaul.length)];
    } else {
      // 少數使用波音
      return aircraftTypes.shortHaulBoeing[Math.floor(Math.random() * aircraftTypes.shortHaulBoeing.length)];
    }
  } 
  // 區域短途航班 (<2小時)
  else {
    // 80%機率使用短途窄體機
    if (Math.random() < 0.8) {
      // 使用A320系列或737系列
      const shortOptions = [...aircraftTypes.shortHaul, ...aircraftTypes.shortHaulBoeing];
      return shortOptions[Math.floor(Math.random() * shortOptions.length)];
    } else {
      // 20%機率使用區域噴射機
      return aircraftTypes.regional[Math.floor(Math.random() * aircraftTypes.regional.length)];
    }
  }
}

// 隨機生成艙位可用性
function generateCabinAvailability(aircraft: string, hasFirstClass: boolean): Flight['cabinAvailability'] {
  // 隨機決定是否有艙位售罄
  const isSoldOut = Math.random() < 0.3; // 30%機率某個艙位售罄
  
  if (!isSoldOut) {
    return {
      economy: true,
      business: true,
      first: hasFirstClass
    };
  }
  
  // 隨機選擇一個艙位售罄
  const soldOutCabin = Math.floor(Math.random() * 3); // 0: 經濟艙, 1: 商務艙, 2: 頭等艙
  
  return {
    economy: soldOutCabin !== 0, // 如果是0，經濟艙售罄
    business: soldOutCabin !== 1, // 如果是1，商務艙售罄
    first: hasFirstClass ? soldOutCabin !== 2 : false // 如果有頭等艙並且是2，頭等艙售罄
  };
}

// 固定的航班數據
export const sampleFlights: Flight[] = [
  {
    id: 'ya101',
    flightNumber: 'YA101',
    departureAirport: '廣州白雲國際機場',
    departureAirportCode: 'CAN',
    arrivalAirport: '台北桃園國際機場',
    arrivalAirportCode: 'TPE',
    departureTime: '2023-05-15T07:30:00',
    durationMinutes: 120,
    hasStops: false,
    prices: {
      economy: 1200,
      business: 4500,
      first: 8500
    },
    seatsAvailable: 120,
    aircraftType: 'A320neo',
    hasFirstClass: false,
    cabinAvailability: {
      economy: true,
      business: true,
      first: false
    }
  },
  {
    id: 'ya102',
    flightNumber: 'YA102',
    departureAirport: '廣州白雲國際機場',
    departureAirportCode: 'CAN',
    arrivalAirport: '香港國際機場',
    arrivalAirportCode: 'HKG',
    departureTime: '2023-05-15T08:45:00',
    durationMinutes: 70,
    hasStops: false,
    prices: {
      economy: 800,
      business: 2800,
      first: 5600
    },
    seatsAvailable: 150,
    aircraftType: 'A319neo',
    hasFirstClass: false,
    cabinAvailability: {
      economy: true,
      business: false, // 商務艙售罄
      first: false
    }
  },
  {
    id: 'ya201',
    flightNumber: 'YA201',
    departureAirport: '廣州白雲國際機場',
    departureAirportCode: 'CAN',
    arrivalAirport: '東京成田國際機場',
    arrivalAirportCode: 'NRT',
    departureTime: '2023-05-15T11:20:00',
    durationMinutes: 240,
    hasStops: false,
    prices: {
      economy: 2200,
      business: 6800,
      first: 12000
    },
    seatsAvailable: 180,
    aircraftType: 'A330-300',
    hasFirstClass: false,
    cabinAvailability: {
      economy: true,
      business: true,
      first: false
    }
  },
  {
    id: 'ya301',
    flightNumber: 'YA301',
    departureAirport: '廣州白雲國際機場',
    departureAirportCode: 'CAN',
    arrivalAirport: '新加坡樟宜機場',
    arrivalAirportCode: 'SIN',
    departureTime: '2023-05-15T14:50:00',
    durationMinutes: 220,
    hasStops: false,
    prices: {
      economy: 1800,
      business: 5500,
      first: 10000
    },
    seatsAvailable: 90,
    aircraftType: 'Boeing 787-8',
    hasFirstClass: false,
    cabinAvailability: {
      economy: false, // 經濟艙售罄
      business: true,
      first: false
    }
  },
  {
    id: 'ya401',
    flightNumber: 'YA401',
    departureAirport: '廣州白雲國際機場',
    departureAirportCode: 'CAN',
    arrivalAirport: '首爾仁川國際機場',
    arrivalAirportCode: 'ICN',
    departureTime: '2023-05-15T09:15:00',
    durationMinutes: 190,
    hasStops: false,
    prices: {
      economy: 1600,
      business: 4800,
      first: 9000
    },
    seatsAvailable: 110,
    aircraftType: 'A321neo',
    hasFirstClass: false,
    cabinAvailability: {
      economy: true,
      business: true,
      first: false
    }
  },
  {
    id: 'ya501',
    flightNumber: 'YA501',
    departureAirport: '廣州白雲國際機場',
    departureAirportCode: 'CAN',
    arrivalAirport: '曼谷素萬那普國際機場',
    arrivalAirportCode: 'BKK',
    departureTime: '2023-05-15T16:30:00',
    durationMinutes: 150,
    hasStops: false,
    prices: {
      economy: 1100,
      business: 3200,
      first: 6000
    },
    seatsAvailable: 140,
    aircraftType: 'Boeing 737 MAX 9',
    hasFirstClass: false,
    cabinAvailability: {
      economy: true,
      business: true,
      first: false
    }
  },
  {
    id: 'ya601',
    flightNumber: 'YA601',
    departureAirport: '廣州白雲國際機場',
    departureAirportCode: 'CAN',
    arrivalAirport: '倫敦希思羅機場',
    arrivalAirportCode: 'LHR',
    departureTime: '2023-05-15T01:20:00',
    durationMinutes: 720,
    hasStops: true,
    stops: [
      {
        airport: '杜拜國際機場',
        airportCode: 'DXB',
        durationMinutes: 120
      }
    ],
    prices: {
      economy: 4200,
      business: 12000,
      first: 25000
    },
    seatsAvailable: 75,
    aircraftType: 'A350-1000',
    hasFirstClass: true,
    cabinAvailability: {
      economy: true,
      business: true,
      first: true
    }
  },
  {
    id: 'ya701',
    flightNumber: 'YA701',
    departureAirport: '廣州白雲國際機場',
    departureAirportCode: 'CAN',
    arrivalAirport: '紐約甘迺迪國際機場',
    arrivalAirportCode: 'JFK',
    departureTime: '2023-05-15T00:40:00',
    durationMinutes: 960,
    hasStops: true,
    stops: [
      {
        airport: '東京成田國際機場',
        airportCode: 'NRT',
        durationMinutes: 90
      }
    ],
    prices: {
      economy: 5500,
      business: 16000,
      first: 30000
    },
    seatsAvailable: 60,
    aircraftType: 'A380-800',
    hasFirstClass: true,
    cabinAvailability: {
      economy: true,
      business: true,
      first: false // 頭等艙售罄
    }
  },
  {
    id: 'ya801',
    flightNumber: 'YA801',
    departureAirport: '廣州白雲國際機場',
    departureAirportCode: 'CAN',
    arrivalAirport: '巴黎戴高樂機場',
    arrivalAirportCode: 'CDG',
    departureTime: '2023-05-15T02:10:00',
    durationMinutes: 780,
    hasStops: true,
    stops: [
      {
        airport: '上海浦東國際機場',
        airportCode: 'PVG',
        durationMinutes: 60
      }
    ],
    prices: {
      economy: 4000,
      business: 11500,
      first: 22000
    },
    seatsAvailable: 85,
    aircraftType: 'Boeing 777-300ER',
    hasFirstClass: true,
    cabinAvailability: {
      economy: true,
      business: true,
      first: true
    }
  },
  {
    id: 'ya901',
    flightNumber: 'YA901',
    departureAirport: '廣州白雲國際機場',
    departureAirportCode: 'CAN',
    arrivalAirport: '悉尼國際機場',
    arrivalAirportCode: 'SYD',
    departureTime: '2023-05-15T21:50:00',
    durationMinutes: 540,
    hasStops: false,
    prices: {
      economy: 3800,
      business: 9500,
      first: 18000
    },
    seatsAvailable: 95,
    aircraftType: 'Boeing 787-9',
    hasFirstClass: true,
    cabinAvailability: {
      economy: false, // 經濟艙售罄
      business: true,
      first: true
    }
  }
]; 