// 定義機場數據類型
export interface Airport {
  code: string;       // 機場代碼
  name: string;       // 機場全名
  city: string;       // 所在城市
  country: string;    // 所在國家 
  location: {         // 地理位置
    lat: number;      // 緯度
    lng: number;      // 經度
  };
}

// 計算兩個地理座標之間的距離（使用 Haversine 公式）
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 地球半徑（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // 距離（公里）

  return distance;
}

// 機場數據庫
export const airports: Airport[] = [
  { code: 'TPE', name: '桃園國際機場', city: '台北', country: '中國台灣', location: { lat: 25.0797, lng: 121.2342 } },
  { code: 'HKG', name: '香港國際機場', city: '香港', country: '中國', location: { lat: 22.3080, lng: 113.9185 } },
  { code: 'MFM', name: '澳門國際機場', city: '澳門', country: '中國', location: { lat: 22.1496, lng: 113.5916 } },
  { code: 'PVG', name: '浦東國際機場', city: '上海', country: '中國', location: { lat: 31.1443, lng: 121.8083 } },
  { code: 'SHA', name: '虹橋國際機場', city: '上海', country: '中國', location: { lat: 31.1979, lng: 121.3363 } },
  { code: 'PEK', name: '首都國際機場', city: '北京', country: '中國', location: { lat: 40.0799, lng: 116.6031 } },
  { code: 'PKX', name: '大興國際機場', city: '北京', country: '中國', location: { lat: 39.5098, lng: 116.4105 } },
  { code: 'CAN', name: '白雲國際機場', city: '廣州', country: '中國', location: { lat: 23.3959, lng: 113.3080 } },
  { code: 'SZX', name: '寶安國際機場', city: '深圳', country: '中國', location: { lat: 22.6394, lng: 113.8132 } },
  { code: 'CTU', name: '雙流國際機場', city: '成都', country: '中國', location: { lat: 30.5785, lng: 103.9471 } },
  { code: 'TFU', name: '天府國際機場', city: '成都', country: '中國', location: { lat: 30.3125, lng: 104.4415 } },
  { code: 'XIY', name: '咸陽國際機場', city: '西安', country: '中國', location: { lat: 34.4471, lng: 108.7516 } },
  { code: 'KMG', name: '長水國際機場', city: '昆明', country: '中國', location: { lat: 25.1019, lng: 102.9490 } },
  { code: 'CKG', name: '江北國際機場', city: '重慶', country: '中國', location: { lat: 29.7192, lng: 106.6413 } },
  { code: 'TAO', name: '流亭國際機場', city: '青島', country: '中國', location: { lat: 36.2661, lng: 120.3744 } },
  { code: 'TSN', name: '濱海國際機場', city: '天津', country: '中國', location: { lat: 39.1246, lng: 117.3462 } },
  { code: 'CGO', name: '新鄭國際機場', city: '鄭州', country: '中國', location: { lat: 34.5196, lng: 113.8408 } },
  { code: 'WUH', name: '天河國際機場', city: '武漢', country: '中國', location: { lat: 30.7838, lng: 114.2081 } },
  { code: 'HGH', name: '蕭山國際機場', city: '杭州', country: '中國', location: { lat: 30.2294, lng: 120.4312 } },
  { code: 'NKG', name: '祿口國際機場', city: '南京', country: '中國', location: { lat: 31.7416, lng: 118.8603 } },
  { code: 'FOC', name: '長樂國際機場', city: '福州', country: '中國', location: { lat: 25.9335, lng: 119.6631 } },
  { code: 'XMN', name: '高崎國際機場', city: '廈門', country: '中國', location: { lat: 24.5440, lng: 118.1272 } },
  { code: 'CSX', name: '黃花國際機場', city: '長沙', country: '中國', location: { lat: 28.1892, lng: 113.2184 } },
  { code: 'LXA', name: '貢嘎機場', city: '拉薩', country: '中國', location: { lat: 29.2977, lng: 90.9118 } },
  { code: 'LHW', name: '中川國際機場', city: '蘭州', country: '中國', location: { lat: 36.5151, lng: 103.6204 } },
  { code: 'URC', name: '地窩堡國際機場', city: '烏魯木齊', country: '中國', location: { lat: 43.9071, lng: 87.4742 } },
  { code: 'HRB', name: '太平國際機場', city: '哈爾濱', country: '中國', location: { lat: 45.6234, lng: 126.2500 } },
  { code: 'DLC', name: '周水子國際機場', city: '大連', country: '中國', location: { lat: 38.9657, lng: 121.5386 } },
  { code: 'KWL', name: '兩江國際機場', city: '桂林', country: '中國', location: { lat: 25.2178, lng: 110.0390 } },
  { code: 'HAK', name: '美蘭國際機場', city: '海口', country: '中國', location: { lat: 19.9349, lng: 110.4590 } },
  { code: 'SYX', name: '鳳凰國際機場', city: '三亞', country: '中國', location: { lat: 18.3029, lng: 109.4127 } },
  { code: 'TNA', name: '遙牆國際機場', city: '濟南', country: '中國', location: { lat: 36.8571, lng: 117.2158 } },
  { code: 'NYI', name: '波密魯朗機場', city: '波密', country: '中國', location: { lat: 29.3386, lng: 95.1009 } },
  { code: 'BPX', name: '邦達機場', city: '昌都', country: '中國', location: { lat: 30.5536, lng: 97.1083 } },
  { code: 'NRT', name: '成田國際機場', city: '東京', country: '日本', location: { lat: 35.7720, lng: 140.3929 } },
  { code: 'HND', name: '羽田機場', city: '東京', country: '日本', location: { lat: 35.5494, lng: 139.7798 } },
  { code: 'KIX', name: '關西國際機場', city: '大阪', country: '日本', location: { lat: 34.4320, lng: 135.2304 } },
  { code: 'ICN', name: '仁川國際機場', city: '首爾', country: '韓國', location: { lat: 37.4602, lng: 126.4407 } },
  { code: 'BKK', name: '素萬那普國際機場', city: '曼谷', country: '泰國', location: { lat: 13.6900, lng: 100.7501 } },
  { code: 'SIN', name: '樟宜機場', city: '新加坡', country: '新加坡', location: { lat: 1.3644, lng: 103.9915 } },
  { code: 'KUL', name: '吉隆坡國際機場', city: '吉隆坡', country: '馬來西亞', location: { lat: 2.7456, lng: 101.7099 } },
  { code: 'MNL', name: '尼諾伊·阿基諾國際機場', city: '馬尼拉', country: '菲律賓', location: { lat: 14.5086, lng: 121.0194 } },
  { code: 'CGK', name: '蘇加諾-哈達國際機場', city: '雅加達', country: '印尼', location: { lat: -6.1256, lng: 106.6558 } },
  { code: 'DPS', name: '伍拉·賴國際機場', city: '巴厘島', country: '印尼', location: { lat: -8.7467, lng: 115.1667 } },
  { code: 'SYD', name: '悉尼國際機場', city: '悉尼', country: '澳大利亞', location: { lat: -33.9399, lng: 151.1753 } },
  { code: 'MEL', name: '墨爾本機場', city: '墨爾本', country: '澳大利亞', location: { lat: -37.6690, lng: 144.8410 } },
  { code: 'BNE', name: '布里斯本機場', city: '布里斯本', country: '澳大利亞', location: { lat: -27.3942, lng: 153.1218 } },
  { code: 'LAX', name: '洛杉磯國際機場', city: '洛杉磯', country: '美國', location: { lat: 33.9416, lng: -118.4085 } },
  { code: 'SFO', name: '舊金山國際機場', city: '舊金山', country: '美國', location: { lat: 37.6213, lng: -122.3790 } },
  { code: 'JFK', name: '甘迺迪國際機場', city: '紐約', country: '美國', location: { lat: 40.6413, lng: -73.7781 } },
  { code: 'LHR', name: '希思羅機場', city: '倫敦', country: '英國', location: { lat: 51.4700, lng: -0.4543 } },
  { code: 'CDG', name: '戴高樂機場', city: '巴黎', country: '法國', location: { lat: 49.0097, lng: 2.5479 } },
  { code: 'FRA', name: '法蘭克福國際機場', city: '法蘭克福', country: '德國', location: { lat: 50.0379, lng: 8.5622 } }
];

// 根據代碼獲取機場信息
export function getAirportByCode(code: string): Airport | undefined {
  // 先嘗試從現有機場數據中查找
  const airport = airports.find(airport => airport.code === code);
  
  // 如果找到了機場，直接返回
  if (airport) {
    return airport;
  }
  
  // 如果找不到但有三字代碼，創建一個模擬機場
  if (code && code.length === 3) {
    // 嘗試基於常見的機場代碼規則推測城市名稱
    let cityName = code;
    let country = '未知';
    
    // 基於地區代碼推測國家/城市
    if (code.startsWith('Z') || code.startsWith('V') || code.startsWith('B') || code.startsWith('Y')) {
      country = '中國';
    } else if (code.startsWith('R')) {
      country = '台灣/日本/韓國';
    } else if (code.startsWith('W') || code.startsWith('V')) {
      country = '東南亞';
    } else if (code.startsWith('E')) {
      country = '北歐';
    } else if (code.startsWith('L')) {
      country = '南歐';
    } else if (code.startsWith('K')) {
      country = '美國';
    } else if (code.startsWith('Y')) {
      country = '澳洲';
    } else if (code.startsWith('EG')) {
      country = '英國';
    }
    
    // 為了計算距離，選擇一個參考機場的位置，這裡選廣州作為中心點
    const referenceAirport = airports.find(a => a.code === 'CAN') || 
                             { location: { lat: 23.3959, lng: 113.3080 } };
    
    // 假設未知機場距離參考點在500-5000公里範圍內的隨機位置
    const distance = Math.random() * 4500 + 500; // 500-5000公里
    const angle = Math.random() * 2 * Math.PI; // 隨機方向
    
    // 計算新位置 (這是一個簡化的球面計算)
    const latRadian = referenceAirport.location.lat * Math.PI / 180;
    const lngRadian = referenceAirport.location.lng * Math.PI / 180;
    
    // 地球半徑 (公里)
    const R = 6371;
    
    // 計算新的緯度和經度
    const newLat = Math.asin(
      Math.sin(latRadian) * Math.cos(distance/R) + 
      Math.cos(latRadian) * Math.sin(distance/R) * Math.cos(angle)
    ) * 180 / Math.PI;
    
    const newLng = (lngRadian + 
      Math.atan2(
        Math.sin(angle) * Math.sin(distance/R) * Math.cos(latRadian),
        Math.cos(distance/R) - Math.sin(latRadian) * Math.sin(newLat * Math.PI / 180)
      )
    ) * 180 / Math.PI;
    
    return {
      code: code,
      name: `${code} 國際機場`,
      city: cityName,
      country: country,
      location: { 
        lat: newLat, 
        lng: newLng 
      }
    };
  }
  
  // 如果沒有有效的三字代碼，返回undefined
  return undefined;
}

// 根據搜索詞過濾機場
export function searchAirports(query: string): Airport[] {
  if (!query || query.trim() === '') return [];
  
  const lowercaseQuery = query.toLowerCase();
  
  return airports.filter(airport => 
    airport.code.toLowerCase().includes(lowercaseQuery) ||
    airport.name.toLowerCase().includes(lowercaseQuery) ||
    airport.city.toLowerCase().includes(lowercaseQuery) ||
    airport.country.toLowerCase().includes(lowercaseQuery)
  );
}

// 獲取按國家分組的機場
export function getAirportsByCountry(): Record<string, Airport[]> {
  const airportsByCountry: Record<string, Airport[]> = {};
  
  airports.forEach(airport => {
    if (!airportsByCountry[airport.country]) {
      airportsByCountry[airport.country] = [];
    }
    airportsByCountry[airport.country].push(airport);
  });
  
  return airportsByCountry;
}

// 獲取熱門機場（前10個）
export function getPopularAirports(): Airport[] {
  return [
    getAirportByCode('CAN')!,
    getAirportByCode('PEK')!,
    getAirportByCode('PVG')!,
    getAirportByCode('CTU')!,
    getAirportByCode('SZX')!,
    getAirportByCode('HKG')!,
    getAirportByCode('TPE')!,
    getAirportByCode('MFM')!,
    getAirportByCode('LXA')!,
    getAirportByCode('CKG')!
  ].filter(Boolean); // 過濾掉可能的undefined值
} 