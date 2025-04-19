// 生成航班數據並保存為 JSON 和 CSV 文件
const fs = require('fs');
const path = require('path');
const { generateAllFlights } = require('../utils/flightGenerator');

// 確保 data 目錄存在
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 生成所有航班數據
console.log('正在生成航班數據...');
const allFlights = generateAllFlights();
console.log(`生成了 ${allFlights.length} 個航班數據`);

// 保存為 JSON 文件
const jsonFilePath = path.join(dataDir, 'flights.json');
fs.writeFileSync(jsonFilePath, JSON.stringify(allFlights, null, 2));
console.log(`JSON 數據已保存至: ${jsonFilePath}`);

// 轉換為 CSV 格式並保存
const csvRows = [];

// CSV 標題行
csvRows.push([
  'ID',
  '航班號',
  '出發機場',
  '出發機場代碼',
  '到達機場',
  '到達機場代碼',
  '出發時間',
  '飛行時長(分鐘)',
  '是否中轉',
  '中轉站點',
  '經濟艙票價',
  '商務艙票價',
  '頭等艙票價',
  '可用座位數'
].join(','));

// 數據行
allFlights.forEach(flight => {
  const stopsString = flight.hasStops && flight.stops 
    ? flight.stops.map(stop => stop.airportCode).join(';')
    : '';
  
  csvRows.push([
    flight.id,
    flight.flightNumber,
    flight.departureAirport,
    flight.departureAirportCode,
    flight.arrivalAirport,
    flight.arrivalAirportCode,
    flight.departureTime,
    flight.durationMinutes,
    flight.hasStops ? 'true' : 'false',
    stopsString,
    flight.prices.economy,
    flight.prices.business,
    flight.prices.first,
    flight.seatsAvailable
  ].join(','));
});

const csvContent = csvRows.join('\n');
const csvFilePath = path.join(dataDir, 'flights.csv');
fs.writeFileSync(csvFilePath, csvContent);
console.log(`CSV 數據已保存至: ${csvFilePath}`);

console.log('航班數據生成完成！'); 