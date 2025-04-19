'use client';

import { useState } from 'react';
import { format, addMinutes } from 'date-fns';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { Flight } from '../../types/Flight';
import { createBookingFromFlights } from '../../utils/bookingService';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import { FaSuitcase, FaPlane, FaCheck, FaTimes, FaWifi, FaUtensils, FaTicketAlt } from 'react-icons/fa';
import { MdAirlineSeatReclineNormal, MdSecurity, MdAirplanemodeActive } from 'react-icons/md';
import { BsFillPersonVcardFill } from 'react-icons/bs';

interface FlightSelectModalProps {
  flight: Flight;
  cabinClass: 'economy' | 'business' | 'first';
  isRoundTrip?: boolean;
  returnFlight?: Flight;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const FlightSelectModal = ({
  flight,
  cabinClass,
  isRoundTrip = false,
  returnFlight,
  isOpen,
  onClose,
  onConfirm
}: FlightSelectModalProps) => {
  const router = useRouter();
  const [passengers, setPassengers] = useState([
    { type: 'adult', count: 1, label: '成人' }
  ]);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { formatPrice } = useCurrency();
  const [selectedFareType, setSelectedFareType] = useState<'basic'|'plus'|'flex'>('basic');

  const departureDateTime = new Date(flight.departureTime);
  const arrivalDateTime = addMinutes(departureDateTime, flight.durationMinutes);

  let returnDepartureDateTime, returnArrivalDateTime;
  if (isRoundTrip && returnFlight) {
    returnDepartureDateTime = new Date(returnFlight.departureTime);
    returnArrivalDateTime = addMinutes(returnDepartureDateTime, returnFlight.durationMinutes);
  }

  // 格式化時間
  const formatTime = (date: Date) => format(date, 'HH:mm');

  // 格式化日期
  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

  // 格式化持續時間
  const formatFlightDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // 根據艙位顯示不同的標籤
  const getCabinLabel = () => {
    switch(cabinClass) {
      case 'business': return '商務艙';
      case 'first': return '頭等艙';
      default: return '經濟艙';
    }
  };

  // 定義不同票價等級的選項
  const getFareOptions = () => {
    // 基本價格
    const basePrice = flight.prices[cabinClass];
    
    const fareOptions = {
      basic: {
        name: `${getCabinLabel()} Basic`,
        price: basePrice,
        changePolicy: '每位旅客最高 250，另加差額',
        refundPolicy: '不允許',
        cabinBaggage: cabinClass === 'economy' ? '1 x 8kg (18lb)' : '2 x 8kg (18lb)',
        checkedBaggage: cabinClass === 'economy' ? '1× 23kg (50lb)' : '2× 32kg (70lb)',
        seatSelection: cabinClass === 'economy' ? '需另外付費' : '已包括',
        prioritySecurity: cabinClass === 'economy' ? '不適用' : '已包括',
        loungeAccess: cabinClass === 'economy' ? '不適用' : '已包括',
        priorityBoarding: cabinClass === 'economy' ? '不適用' : '已包括',
        catering: '餐點',
        miles: Math.round(basePrice * 1.5),
      },
      plus: {
        name: `${getCabinLabel()} Basic Plus`,
        price: basePrice * 1.15,
        changePolicy: '每位旅客最高 250，另加差額',
        refundPolicy: '可退票，但須扣除 250',
        cabinBaggage: cabinClass === 'economy' ? '1 x 8kg (18lb)' : '2 x 8kg (18lb)',
        checkedBaggage: cabinClass === 'economy' ? '2× 23kg (50lb)' : '2× 32kg (70lb)',
        seatSelection: '已包括',
        prioritySecurity: cabinClass === 'economy' ? '不適用' : '已包括',
        loungeAccess: cabinClass === 'economy' ? '不適用' : '已包括',
        priorityBoarding: cabinClass === 'economy' ? '可選購' : '已包括',
        catering: '餐點',
        miles: Math.round(basePrice * 1.8),
      },
      flex: {
        name: `${getCabinLabel()} Flex`,
        price: basePrice * 1.3,
        changePolicy: '免費更改',
        refundPolicy: '全額退款',
        cabinBaggage: cabinClass === 'economy' ? '1 x 8kg (18lb)' : '2 x 8kg (18lb)',
        checkedBaggage: cabinClass === 'economy' ? '2× 23kg (50lb)' : '3× 32kg (70lb)',
        seatSelection: '已包括',
        prioritySecurity: '已包括',
        loungeAccess: cabinClass === 'economy' ? '可選購' : '已包括',
        priorityBoarding: '已包括',
        catering: '餐點, Refreshment',
        miles: Math.round(basePrice * 2),
      }
    };
    
    return fareOptions;
  };

  // 計算總價
  const calculateTotalPrice = () => {
    const fareOptions = getFareOptions();
    let totalPrice = fareOptions[selectedFareType].price;
    
    if (isRoundTrip && returnFlight) {
      // 假設回程也使用相同票價類型
      totalPrice += fareOptions[selectedFareType].price;
    }
    
    // 乘以乘客數
    const totalPassengers = passengers.reduce((acc, passenger) => acc + passenger.count, 0);
    totalPrice *= totalPassengers;
    
    return totalPrice;
  };

  // 驗證表單
  const validateForm = () => {
    if (!contactInfo.name.trim()) {
      setFormError('請輸入聯繫人姓名');
      return false;
    }
    
    if (!contactInfo.phone.trim()) {
      setFormError('請輸入聯繫電話');
      return false;
    }
    
    if (!contactInfo.email.trim()) {
      setFormError('請輸入電子郵箱');
      return false;
    }
    
    // 簡單的郵箱格式驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      setFormError('請輸入有效的電子郵箱地址');
      return false;
    }
    
    setFormError('');
    return true;
  };

  // 處理預訂提交
  const handleConfirmBooking = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 創建預訂
      const booking = createBookingFromFlights(
        flight,
        cabinClass,
        isRoundTrip,
        returnFlight,
        passengers,
        contactInfo
      );
      
      // 更新狀態
      setBookingSuccess(true);
      setIsSubmitting(false);
      
      // 提示用戶
      onConfirm();
      
      // 延遲關閉模態窗口，以便用戶看到成功訊息
      setTimeout(() => {
        onClose();
        // 導航到預訂頁面
        router.push('/bookings');
      }, 2000);
    } catch (error) {
      console.error('預訂失敗:', error);
      setFormError('預訂過程中發生錯誤，請稍後再試');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // 如果預訂成功，顯示成功訊息
  if (bookingSuccess) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    預訂成功！
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      您的航班預訂已確認，謝謝您選擇黃航空。
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      正在跳轉到我的預訂頁面...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 在確認預訂前的模態窗口內容 (非成功狀態)
  if (!bookingSuccess) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">關閉</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-2xl leading-6 font-bold text-gray-900 pb-4 border-b">
                    確認您的航班
                  </h3>
                  
                  <div className="mt-6">
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h4 className="font-medium text-lg text-gray-800 mb-3">去程航班</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xl font-bold">
                            {formatTime(departureDateTime)} - {formatTime(arrivalDateTime)}
                          </div>
                          <div className="text-gray-600 mt-1">
                            {formatDate(departureDateTime)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {flight.flightNumber} • {getCabinLabel()} • {formatFlightDuration(flight.durationMinutes)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            {flight.departureAirportCode} → {flight.arrivalAirportCode}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {flight.hasStops ? `${flight.stops!.length}次中轉` : '直飛'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {isRoundTrip && returnFlight && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h4 className="font-medium text-lg text-gray-800 mb-3">回程航班</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xl font-bold">
                              {formatTime(returnDepartureDateTime!)} - {formatTime(returnArrivalDateTime!)}
                            </div>
                            <div className="text-gray-600 mt-1">
                              {formatDate(returnDepartureDateTime!)}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {returnFlight.flightNumber} • {getCabinLabel()} • {formatFlightDuration(returnFlight.durationMinutes)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              {returnFlight.departureAirportCode} → {returnFlight.arrivalAirportCode}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {returnFlight.hasStops ? `${returnFlight.stops!.length}次中轉` : '直飛'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 票價類型選擇 */}
                    <div className="mb-6">
                      <h4 className="font-medium text-lg text-gray-800 mb-3">選取票價</h4>
                      <p className="text-sm text-gray-600 mb-4">比較票價和預訂艙等</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(getFareOptions()).map(([key, option]) => (
                          <div 
                            key={key} 
                            className={`border rounded-lg overflow-hidden shadow-sm transition-all duration-300 ${selectedFareType === key ? 'border-ya-yellow-500 shadow-md ring-2 ring-ya-yellow-300' : 'border-gray-200 hover:border-gray-300 hover:shadow'}`}
                          >
                            <div 
                              className={`p-4 cursor-pointer ${selectedFareType === key ? 'bg-ya-yellow-50' : ''}`}
                              onClick={() => setSelectedFareType(key as 'basic'|'plus'|'flex')}
                            >
                              <div className="flex items-center justify-between">
                                <div className="font-bold text-xl text-ya-yellow-700">{formatPrice(option.price)}</div>
                                <div className={`w-5 h-5 rounded-full ${selectedFareType === key ? 'bg-ya-yellow-500' : 'border-2 border-gray-300'}`}></div>
                              </div>
                              <div className="font-medium text-gray-800 mb-1">{option.name}</div>
                              <div className="text-xs text-gray-500 mb-4">選擇此等級以獲得如下服務</div>
                              
                              <div className="space-y-3 mt-4 text-sm">
                                <div className="flex items-start">
                                  <FaTicketAlt className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                  <div>
                                    <div className="font-medium">修改預訂</div>
                                    <div className="text-gray-600">{option.changePolicy}</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-start">
                                  <FaTicketAlt className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                  <div>
                                    <div className="font-medium">退款</div>
                                    <div className="text-gray-600">{option.refundPolicy}</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-start">
                                  <FaSuitcase className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                  <div>
                                    <div className="font-medium">随身行李</div>
                                    <div className="text-gray-600">{option.cabinBaggage}</div>
                                    <div className="text-gray-500 text-xs">最大55 x 40 x 23厘米</div>
                                    <div className="text-gray-500 text-xs">1件個人物品</div>
                                    <div className="text-gray-500 text-xs">最大40 x 30 x 10厘米</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-start">
                                  <FaSuitcase className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                  <div>
                                    <div className="font-medium">託運行李</div>
                                    <div className="text-gray-600">{option.checkedBaggage}</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-start">
                                  <MdAirlineSeatReclineNormal className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                  <div>
                                    <div className="font-medium">預訂座位（若有）</div>
                                    <div className="text-gray-600">{option.seatSelection}</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-start">
                                  <MdSecurity className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                  <div>
                                    <div className="font-medium">快速安檢通道（若有）</div>
                                    <div className="text-gray-600">{option.prioritySecurity}</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-start">
                                  <BsFillPersonVcardFill className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                  <div>
                                    <div className="font-medium">機場貴賓室（若有）</div>
                                    <div className="text-gray-600">{option.loungeAccess}</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-start">
                                  <MdAirplanemodeActive className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                  <div>
                                    <div className="font-medium">優先登機（若有）</div>
                                    <div className="text-gray-600">{option.priorityBoarding}</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-start">
                                  <FaUtensils className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                  <div>
                                    <div className="font-medium">機上餐飲</div>
                                    <div className="text-gray-600">{option.catering}</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-start">
                                  <FaPlane className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                  <div>
                                    <div className="font-medium">{option.miles} Miles</div>
                                    <div className="text-gray-600">已包括</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div 
                              className={`p-3 text-center font-medium text-sm cursor-pointer border-t ${selectedFareType === key ? 'bg-ya-yellow-500 text-white border-ya-yellow-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'}`}
                              onClick={() => setSelectedFareType(key as 'basic'|'plus'|'flex')}
                            >
                              {selectedFareType === key ? '已選擇' : '選擇此票價'}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <p className="text-sm text-gray-500 mt-4">
                        請選擇票價以繼續。可能會收取額外行李費。
                        <a href="/baggage" className="text-ya-yellow-600 ml-1 hover:text-ya-yellow-700 underline">查看詳情</a>
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium text-lg text-gray-800 mb-3">旅客信息</h4>
                      {passengers.map((passenger, index) => (
                        <div key={index} className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span className="text-gray-600">{passenger.label} {index + 1}</span>
                          </div>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => {
                                const newPassengers = [...passengers];
                                if (newPassengers[index].count > 1) {
                                  newPassengers[index].count -= 1;
                                } else if (passengers.length > 1) {
                                  newPassengers.splice(index, 1);
                                }
                                setPassengers(newPassengers);
                              }}
                              className="text-gray-500 p-1 hover:bg-gray-100 rounded"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                              </svg>
                            </button>
                            <span className="mx-3">{passenger.count}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newPassengers = [...passengers];
                                newPassengers[index].count += 1;
                                setPassengers(newPassengers);
                              }}
                              className="text-gray-500 p-1 hover:bg-gray-100 rounded"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setPassengers([...passengers, { type: 'child', count: 1, label: '兒童' }]);
                        }}
                        className="text-ya-yellow-600 text-sm hover:text-ya-yellow-700 mt-2"
                      >
                        + 添加旅客
                      </button>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium text-lg text-gray-800 mb-3">聯繫方式</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            姓名
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="請輸入聯繫人姓名"
                            value={contactInfo.name}
                            onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            電話
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="請輸入聯繫電話"
                            value={contactInfo.phone}
                            onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="請輸入電子郵箱"
                            value={contactInfo.email}
                            onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      {formError && (
                        <div className="mt-2 text-sm text-red-600">
                          {formError}
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">票價總計</span>
                        <span className="text-xl font-bold text-ya-yellow-600">{formatPrice(calculateTotalPrice())}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        包含稅費和服務費
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-ya-yellow-600 text-base font-medium text-white hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500 sm:ml-3 sm:w-auto sm:text-sm ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
              >
                {isSubmitting ? '處理中...' : '確認並支付'}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
                disabled={isSubmitting}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default FlightSelectModal; 