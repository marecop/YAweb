import { Flight } from '../types/Flight';

// 預訂類型
export interface Booking {
  id: string;
  userId: string;
  flightNumber: string;
  departure: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  returnFlightNumber?: string;
  returnDeparture?: string;
  returnDestination?: string;
  returnDepartureDate?: string;
  returnDepartureTime?: string;
  passengers: {
    type: string;
    count: number;
    label: string;
  }[];
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
  cabinClass: 'economy' | 'business' | 'first';
  totalPrice: number;
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'canceled';
}

// 本地存儲鍵
const BOOKINGS_STORAGE_KEY = 'yellairlines_bookings';

// 根據用戶ID獲取預訂
export function getBookingsByUserId(userId: string): Booking[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const bookingsJson = localStorage.getItem(BOOKINGS_STORAGE_KEY);
  if (!bookingsJson) {
    return [];
  }
  
  try {
    const allBookings: Booking[] = JSON.parse(bookingsJson);
    // 僅返回當前用戶的預訂
    return allBookings.filter(booking => booking.userId === userId);
  } catch (error) {
    console.error('解析預訂數據失敗:', error);
    return [];
  }
}

// 獲取所有預訂（管理員功能）
export function getAllBookings(): Booking[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const bookingsJson = localStorage.getItem(BOOKINGS_STORAGE_KEY);
  if (!bookingsJson) {
    return [];
  }
  
  try {
    return JSON.parse(bookingsJson);
  } catch (error) {
    console.error('解析預訂數據失敗:', error);
    return [];
  }
}

// 向後兼容的預訂獲取方法
export function getBookings(): Booking[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  // 檢查是否有用戶ID在會話存儲中
  const userJson = localStorage.getItem('yellairlines_user');
  if (!userJson) {
    return [];
  }
  
  try {
    const user = JSON.parse(userJson);
    if (user && user.id) {
      return getBookingsByUserId(user.id);
    } else {
      return [];
    }
  } catch (error) {
    console.error('解析用戶數據失敗:', error);
    return [];
  }
}

// 根據ID獲取預訂
export function getBookingById(id: string): Booking | undefined {
  const bookings = getAllBookings();
  return bookings.find(booking => booking.id === id);
}

// 創建新預訂
export function createBooking(bookingData: Omit<Booking, 'id' | 'bookingDate' | 'status' | 'userId'>, userId: string): Booking {
  // 生成唯一ID
  const id = `b${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;
  
  // 創建預訂
  const newBooking: Booking = {
    ...bookingData,
    id,
    userId,
    bookingDate: new Date().toISOString(),
    status: 'confirmed'
  };
  
  // 獲取現有預訂
  const bookings = getAllBookings();
  
  // 添加新預訂
  const updatedBookings = [...bookings, newBooking];
  
  // 保存到本地存儲
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updatedBookings));
  
  return newBooking;
}

// 取消預訂
export function cancelBooking(id: string, userId?: string): boolean {
  const bookings = getAllBookings();
  const booking = bookings.find(booking => booking.id === id);
  
  // 如果指定了用戶ID，確保只能取消自己的預訂
  if (userId && booking && booking.userId !== userId) {
    return false;
  }
  
  const bookingIndex = bookings.findIndex(booking => booking.id === id);
  
  if (bookingIndex === -1) {
    return false;
  }
  
  // 更新狀態為已取消
  bookings[bookingIndex].status = 'canceled';
  
  // 保存到本地存儲
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  
  return true;
}

// 從航班數據創建預訂
export function createBookingFromFlights(
  flight: Flight,
  cabinClass: 'economy' | 'business' | 'first',
  isRoundTrip: boolean,
  returnFlight: Flight | undefined,
  passengers: { type: string; count: number; label: string }[],
  contactInfo: { name: string; phone: string; email: string }
): Booking {
  // 獲取當前登錄用戶信息
  const userJson = localStorage.getItem('yellairlines_user');
  let userId = 'guest';
  
  if (userJson) {
    try {
      const user = JSON.parse(userJson);
      if (user && user.id) {
        userId = user.id;
      }
    } catch (error) {
      console.error('解析用戶數據失敗:', error);
    }
  }
  
  // 計算總價
  let totalPrice = flight.prices[cabinClass];
  if (isRoundTrip && returnFlight) {
    totalPrice += returnFlight.prices[cabinClass];
  }
  
  // 乘以乘客數
  const totalPassengers = passengers.reduce((acc, passenger) => acc + passenger.count, 0);
  totalPrice *= totalPassengers;
  
  // 獲取出發時間
  const departureDateTime = new Date(flight.departureTime);
  const departureDate = departureDateTime.toISOString().split('T')[0];
  const departureTime = departureDateTime.toTimeString().substring(0, 5);
  
  // 準備預訂數據
  const bookingData: Omit<Booking, 'id' | 'bookingDate' | 'status' | 'userId'> = {
    flightNumber: flight.flightNumber,
    departure: `${flight.departureAirport} (${flight.departureAirportCode})`,
    destination: `${flight.arrivalAirport} (${flight.arrivalAirportCode})`,
    departureDate,
    departureTime,
    passengers,
    contactInfo,
    cabinClass,
    totalPrice
  };
  
  // 添加回程航班信息（如果有）
  if (isRoundTrip && returnFlight) {
    const returnDepartureDateTime = new Date(returnFlight.departureTime);
    bookingData.returnFlightNumber = returnFlight.flightNumber;
    bookingData.returnDeparture = `${returnFlight.departureAirport} (${returnFlight.departureAirportCode})`;
    bookingData.returnDestination = `${returnFlight.arrivalAirport} (${returnFlight.arrivalAirportCode})`;
    bookingData.returnDepartureDate = returnDepartureDateTime.toISOString().split('T')[0];
    bookingData.returnDepartureTime = returnDepartureDateTime.toTimeString().substring(0, 5);
  }
  
  // 創建並返回預訂
  return createBooking(bookingData, userId);
} 