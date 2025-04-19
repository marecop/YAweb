// 定義機場類型
export interface Airport {
  code: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  timezone: string;
  international: boolean;
}

// 機場數據
export const airports: Airport[] = [
  { code: 'TPE', name: '台北桃園國際機場', location: { lat: 25.0797, lng: 121.2342 }, timezone: 'Asia/Taipei', international: true },
  { code: 'TSA', name: '台北松山機場', location: { lat: 25.0694, lng: 121.5521 }, timezone: 'Asia/Taipei', international: false },
  { code: 'KHH', name: '高雄國際機場', location: { lat: 22.5771, lng: 120.3504 }, timezone: 'Asia/Taipei', international: true },
  { code: 'HKG', name: '香港國際機場', location: { lat: 22.3080, lng: 113.9185 }, timezone: 'Asia/Hong_Kong', international: true },
  { code: 'NRT', name: '東京成田國際機場', location: { lat: 35.7720, lng: 140.3929 }, timezone: 'Asia/Tokyo', international: true },
  { code: 'HND', name: '東京羽田機場', location: { lat: 35.5494, lng: 139.7798 }, timezone: 'Asia/Tokyo', international: true },
  { code: 'ICN', name: '首爾仁川國際機場', location: { lat: 37.4602, lng: 126.4407 }, timezone: 'Asia/Seoul', international: true },
  { code: 'BKK', name: '曼谷素萬那普國際機場', location: { lat: 13.6900, lng: 100.7501 }, timezone: 'Asia/Bangkok', international: true },
  { code: 'SIN', name: '新加坡樟宜機場', location: { lat: 1.3644, lng: 103.9915 }, timezone: 'Asia/Singapore', international: true },
  { code: 'PVG', name: '上海浦東國際機場', location: { lat: 31.1443, lng: 121.8083 }, timezone: 'Asia/Shanghai', international: false },
  { code: 'SHA', name: '上海虹橋國際機場', location: { lat: 31.1979, lng: 121.3363 }, timezone: 'Asia/Shanghai', international: false },
  { code: 'PEK', name: '北京首都國際機場', location: { lat: 40.0799, lng: 116.6031 }, timezone: 'Asia/Shanghai', international: false },
  { code: 'PKX', name: '北京大興國際機場', location: { lat: 39.5098, lng: 116.4105 }, timezone: 'Asia/Shanghai', international: false },
  { code: 'CAN', name: '廣州白雲國際機場', location: { lat: 23.3959, lng: 113.3080 }, timezone: 'Asia/Shanghai', international: false },
  { code: 'SZX', name: '深圳寶安國際機場', location: { lat: 22.6394, lng: 113.8132 }, timezone: 'Asia/Shanghai', international: false },
  { code: 'CTU', name: '成都雙流國際機場', location: { lat: 30.5785, lng: 103.9471 }, timezone: 'Asia/Shanghai', international: false },
  { code: 'TFU', name: '成都天府國際機場', location: { lat: 30.3125, lng: 104.4415 }, timezone: 'Asia/Shanghai', international: false },
  { code: 'XIY', name: '西安咸陽國際機場', location: { lat: 34.4471, lng: 108.7516 }, timezone: 'Asia/Shanghai', international: false },
  { code: 'KMG', name: '昆明長水國際機場', location: { lat: 25.1019, lng: 102.9490 }, timezone: 'Asia/Shanghai', international: false },
  { code: 'CKG', name: '重慶江北國際機場', location: { lat: 29.7192, lng: 106.6413 }, timezone: 'Asia/Shanghai', international: false },
  { code: 'HGH', name: '杭州蕭山國際機場', location: { lat: 30.2294, lng: 120.4312 }, timezone: 'Asia/Shanghai', international: false },
  { code: 'WUH', name: '武漢天河國際機場', location: { lat: 30.7838, lng: 114.2081 }, timezone: 'Asia/Shanghai', international: false },
  { code: 'NKG', name: '南京祿口國際機場', location: { lat: 31.7416, lng: 118.8603 }, timezone: 'Asia/Shanghai', international: false },
  { code: 'XMN', name: '廈門高崎國際機場', location: { lat: 24.5440, lng: 118.1272 }, timezone: 'Asia/Shanghai', international: false },
  { code: 'CSX', name: '長沙黃花國際機場', location: { lat: 28.1892, lng: 113.2184 }, timezone: 'Asia/Shanghai', international: false },
  { code: 'TAO', name: '青島流亭國際機場', location: { lat: 36.2661, lng: 120.3744 }, timezone: 'Asia/Shanghai', international: false },
  { code: 'TSN', name: '天津濱海國際機場', location: { lat: 39.1246, lng: 117.3462 }, timezone: 'Asia/Shanghai', international: false },
  { code: 'SYD', name: '悉尼國際機場', location: { lat: -33.9399, lng: 151.1753 }, timezone: 'Australia/Sydney', international: false },
  { code: 'LAX', name: '洛杉磯國際機場', location: { lat: 33.9416, lng: -118.4085 }, timezone: 'America/Los_Angeles', international: true },
  { code: 'JFK', name: '紐約甘迺迪國際機場', location: { lat: 40.6413, lng: -73.7781 }, timezone: 'America/New_York', international: true },
  { code: 'LHR', name: '倫敦希思羅機場', location: { lat: 51.4700, lng: -0.4543 }, timezone: 'Europe/London', international: true },
  { code: 'CDG', name: '巴黎戴高樂機場', location: { lat: 49.0097, lng: 2.5479 }, timezone: 'Europe/Paris', international: true },
  { code: 'FRA', name: '法蘭克福國際機場', location: { lat: 50.0379, lng: 8.5622 }, timezone: 'Europe/Berlin', international: true },
  { code: 'DXB', name: '杜拜國際機場', location: { lat: 25.2532, lng: 55.3657 }, timezone: 'Asia/Dubai', international: true },
  { code: 'YYZ', name: '多倫多皮爾遜國際機場', location: { lat: 43.6777, lng: -79.6248 }, timezone: 'America/Toronto', international: true },
  { code: 'AMS', name: '阿姆斯特丹史基浦機場', location: { lat: 52.3105, lng: 4.7683 }, timezone: 'Europe/Amsterdam', international: true },
  { code: 'IST', name: '伊斯坦堡機場', location: { lat: 41.2608, lng: 28.7415 }, timezone: 'Europe/Istanbul', international: true },
  { code: 'DOH', name: '杜哈哈馬德國際機場', location: { lat: 25.2609, lng: 51.6138 }, timezone: 'Asia/Qatar', international: true },
  { code: 'KUL', name: '吉隆坡國際機場', location: { lat: 2.7456, lng: 101.7099 }, timezone: 'Asia/Kuala_Lumpur', international: true },
  { code: 'MNL', name: '馬尼拉尼諾伊阿基諾國際機場', location: { lat: 14.5086, lng: 121.0197 }, timezone: 'Asia/Manila', international: true },
  { code: 'MEX', name: '墨西哥城國際機場', location: { lat: 19.4363, lng: -99.0721 }, timezone: 'America/Mexico_City', international: true },
  { code: 'MAD', name: '馬德里巴拉哈斯國際機場', location: { lat: 40.4983, lng: -3.5676 }, timezone: 'Europe/Madrid', international: true },
  { code: 'SVO', name: '莫斯科謝列梅捷沃國際機場', location: { lat: 55.9726, lng: 37.4146 }, timezone: 'Europe/Moscow', international: true },
  { code: 'DEL', name: '德里英迪拉甘地國際機場', location: { lat: 28.5562, lng: 77.1000 }, timezone: 'Asia/Kolkata', international: true },
  { code: 'SFO', name: '舊金山國際機場', location: { lat: 37.6213, lng: -122.3790 }, timezone: 'America/Los_Angeles', international: true }
]; 