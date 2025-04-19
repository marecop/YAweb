export interface FlightStop {
  airport: string;
  airportCode: string;
  durationMinutes: number;
  terminal?: string; // 中轉航廈
}

export interface Flight {
  id: string;
  flightNumber: string;
  departureAirport: string;
  departureAirportCode: string;
  departureTerminal?: string; // 出發航廈
  arrivalAirport: string;
  arrivalAirportCode: string;
  arrivalTerminal?: string; // 到達航廈
  departureTime: string;
  durationMinutes: number;
  hasStops: boolean;
  stops?: FlightStop[];
  prices: {
    economy: number;
    business: number;
    first: number;
  };
  seatsAvailable: number;
  distance?: number; // 飛行距離（公里）
  aircraftType?: string; // 飛機型號
  hasFirstClass?: boolean; // 是否設有頭等艙
  cabinAvailability?: {
    economy: boolean; // 經濟艙是否有座位
    business: boolean; // 商務艙是否有座位
    first: boolean; // 頭等艙是否有座位
  };
} 