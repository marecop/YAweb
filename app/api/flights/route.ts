import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { generateFlights } from '../../../utils/flightGenerator';

export const GET = async (req: NextRequest) => {
  // 從查詢參數獲取搜索條件
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const cabinClass = searchParams.get('cabinClass') || 'economy';

  // 構建有效的艙位類別
  const validCabinClass = ['economy', 'business', 'first'].includes(cabinClass as string)
    ? cabinClass as 'economy' | 'business' | 'first'
    : 'economy';

  try {
    // 嘗試從文件中讀取所有航班數據
    const dataFilePath = path.join(process.cwd(), 'data', 'flights.json');
    
    // 如果數據文件不存在，則動態生成
    if (!fs.existsSync(dataFilePath)) {
      // 動態生成航班數據
      const flights = generateFlights({
        from,
        to,
        date,
        cabinClass: validCabinClass
      });
      
      // 過濾掉當前選擇的艙等不可用的航班
      const availableFlights = flights.filter(flight => 
        !flight.cabinAvailability || flight.cabinAvailability[validCabinClass]
      );
      
      return NextResponse.json({ flights: availableFlights });
    }
    
    // 從文件讀取數據
    const allFlightsData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    
    // 根據查詢條件過濾航班
    let filteredFlights = allFlightsData;
    
    if (from) {
      filteredFlights = filteredFlights.filter((flight: any) => 
        flight.departureAirportCode === from
      );
    }
    
    if (to) {
      filteredFlights = filteredFlights.filter((flight: any) => 
        flight.arrivalAirportCode === to
      );
    }
    
    if (date) {
      // 只比較日期部分
      const datePrefix = date.split('T')[0];
      filteredFlights = filteredFlights.filter((flight: any) => 
        flight.departureTime.startsWith(datePrefix)
      );
    }
    
    // 過濾掉當前選擇的艙等不可用的航班
    filteredFlights = filteredFlights.filter((flight: any) => 
      !flight.cabinAvailability || flight.cabinAvailability[validCabinClass]
    );
    
    // 根據艙位類別排序，價格低的排前面
    filteredFlights.sort((a: any, b: any) => 
      a.prices[validCabinClass] - b.prices[validCabinClass]
    );
    
    // 只返回前 20 個結果
    filteredFlights = filteredFlights.slice(0, 20);
    
    return NextResponse.json({ flights: filteredFlights });
  } catch (error) {
    console.error('獲取航班數據時出錯:', error);
    
    // 出錯時仍然返回動態生成的航班
    const flights = generateFlights({
      from,
      to,
      date,
      cabinClass: validCabinClass
    });
    
    // 過濾掉當前選擇的艙等不可用的航班
    const availableFlights = flights.filter(flight => 
      !flight.cabinAvailability || flight.cabinAvailability[validCabinClass]
    );
    
    return NextResponse.json({ flights: availableFlights });
  }
}; 