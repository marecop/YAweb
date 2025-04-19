'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import CurrencySelector from '@/app/components/CurrencySelector';

export default function BaggagePage() {
  const [activeTab, setActiveTab] = useState('allowance');
  const [activeCabinClass, setActiveCabinClass] = useState('economy');
  const { formatPrice } = useCurrency();
  
  const tabs = [
    { id: 'allowance', label: '行李限額' },
    { id: 'restricted', label: '限制物品' },
    { id: 'special', label: '特殊行李' },
    { id: 'fees', label: '超額費用' },
  ];

  // 不同艙等的行李限額
  const baggageAllowance = {
    economy: {
      cabinBaggage: '一件手提行李，重量不超過7公斤，尺寸不超過56x36x23厘米',
      checkedBaggage: '一件託運行李，重量不超過23公斤',
      extraFees: '超重/超件費用另計'
    },
    business: {
      cabinBaggage: '兩件手提行李，總重量不超過14公斤，每件尺寸不超過56x36x23厘米',
      checkedBaggage: '兩件託運行李，每件重量不超過32公斤',
      extraFees: '第三件起行李需收費'
    },
    first: {
      cabinBaggage: '兩件手提行李，總重量不超過14公斤，每件尺寸不超過56x36x23厘米',
      checkedBaggage: '三件託運行李，每件重量不超過32公斤',
      extraFees: '第四件起行李需收費'
    }
  };

  // 超額行李費用表（使用數字方便轉換）
  const excessBaggageFees = [
    { 
      weight: '23-32公斤（超重）', 
      economy: 700, 
      business: 500, 
      first: 0 
    },
    { 
      weight: '額外行李（每件23公斤以下）', 
      economy: 1200, 
      business: 1000, 
      first: 800 
    },
    { 
      weight: '超大尺寸行李（159-203厘米）', 
      economy: 1500, 
      business: 1200, 
      first: 1000 
    },
  ];

  // 特殊行李處理費（使用數字方便轉換）
  const specialBaggageFees = [
    { item: '運動設備（高爾夫球桿）', fee: 900 },
    { item: '滑雪/滑水設備', fee: 900 },
    { item: '衝浪板', fee: 1500 },
    { item: '自行車', fee: 1500 },
    { item: '樂器（小型）', fee: 700 },
    { item: '樂器（大型）', fee: 1800 },
    { item: '寵物（機艙）', fee: 1200 },
    { item: '寵物（貨艙）', fee: null }, // 根據重量計費，無固定價格
  ];

  // 限制物品列表
  const restrictedItems = [
    {
      category: '禁止攜帶物品',
      items: [
        '爆炸物和煙火製品（包括仿真爆炸裝置）',
        '壓縮氣體、易燃液體和固體',
        '毒性或傳染性物質',
        '放射性物質',
        '腐蝕性物質',
        '磁性物品',
        '攻擊性武器（槍支、刀具等）',
        '麻醉品和違禁藥物'
      ]
    },
    {
      category: '限制攜帶物品（僅限託運）',
      items: [
        '刀具和剪刀（刀刃長度超過6厘米）',
        '棒球棒、高爾夫球桿等體育器材',
        '工具（扳手、螺絲刀等）',
        '含有鋰電池的電子設備（超過規定容量）',
        '煙花、煙火（民用）',
        '含有酒精的飲料（酒精含量70%以下，每人不超過5升）'
      ]
    },
    {
      category: '可以攜帶但有限制的物品',
      items: [
        '液體、凝膠和噴霧（每個容器不超過100毫升，總量不超過1升）',
        '嬰兒食品（適量）',
        '處方藥物（攜帶處方或醫生證明）',
        '小型電子設備（手機、相機等，鋰電池符合規定）',
        '個人護理用品（化妝品、香水等，容量符合液體規定）'
      ]
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'allowance':
        return (
          <div className="mt-6">
            <div className="mb-6">
              <div className="flex border-b">
                <button 
                  className={`py-2 px-4 font-medium text-sm ${activeCabinClass === 'economy' ? 'border-b-2 border-ya-yellow-500 text-ya-yellow-700' : 'text-gray-500'}`}
                  onClick={() => setActiveCabinClass('economy')}
                >
                  經濟艙
                </button>
                <button 
                  className={`py-2 px-4 font-medium text-sm ${activeCabinClass === 'business' ? 'border-b-2 border-ya-yellow-500 text-ya-yellow-700' : 'text-gray-500'}`}
                  onClick={() => setActiveCabinClass('business')}
                >
                  商務艙
                </button>
                <button 
                  className={`py-2 px-4 font-medium text-sm ${activeCabinClass === 'first' ? 'border-b-2 border-ya-yellow-500 text-ya-yellow-700' : 'text-gray-500'}`}
                  onClick={() => setActiveCabinClass('first')}
                >
                  頭等艙
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-ya-yellow-100 rounded-full mr-4">
                    <svg className="w-6 h-6 text-ya-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">隨身行李</h3>
                </div>
                <p className="text-gray-600">{baggageAllowance[activeCabinClass as keyof typeof baggageAllowance].cabinBaggage}</p>
                <p className="mt-2 text-sm text-gray-500">
                  手提行李必須能放置於客艙行李櫃或前排座位下方，不能阻礙緊急通道。
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-ya-yellow-100 rounded-full mr-4">
                    <svg className="w-6 h-6 text-ya-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">託運行李</h3>
                </div>
                <p className="text-gray-600">{baggageAllowance[activeCabinClass as keyof typeof baggageAllowance].checkedBaggage}</p>
                <p className="mt-2 text-sm text-gray-500">
                  {baggageAllowance[activeCabinClass as keyof typeof baggageAllowance].extraFees}。行李總尺寸（長+寬+高）不得超過158厘米。
                </p>
              </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">嬰兒行李</h3>
              <p className="text-gray-600">
                未滿2歲且不佔座位的嬰兒可以免費攜帶一件不超過10公斤的行李（總尺寸不超過115厘米），以及一台可折疊嬰兒車或嬰兒座椅。
              </p>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">小貼士</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>建議在行李上貼上姓名標籤，並記錄行李的特徵</li>
                <li>貴重物品、易碎物品、重要文件和藥物應隨身攜帶</li>
                <li>在辦理登機手續時，確認您的行李標籤信息正確</li>
                <li>提前到達機場，以便有足夠時間辦理行李托運</li>
                <li>若有特殊行李需求，建議提前24小時聯繫客服</li>
              </ul>
            </div>
          </div>
        );
      case 'restricted':
        return (
          <div className="mt-6">
            <p className="text-gray-600 mb-6">
              根據國際民航組織（ICAO）和國際航空運輸協會（IATA）的規定，以下物品在乘坐黃色航空航班時有特定的限制或禁止攜帶。
            </p>
            
            {restrictedItems.map((category, index) => (
              <div key={index} className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.category}</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            
            <div className="mt-8 bg-ya-yellow-50 border-l-4 border-ya-yellow-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-ya-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-ya-yellow-700">
                    註意：各國海關和安全法規可能有所不同，建議乘客提前了解目的地國家的相關規定。若對攜帶物品有疑問，請提前聯繫我們的客服中心。
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'special':
        return (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                特殊行李需要特別處理和額外收費。請提前至少24小時聯繫我們的客服，以確保您的特殊物品能夠被安全運輸。
              </p>
              <CurrencySelector />
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      物品類型
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      收費標準
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {specialBaggageFees.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.item}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.fee === null ? '根據重量計費' : `${formatPrice(item.fee)} / 件`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">特殊行李注意事項</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>運動設備必須妥善包裝，以防止在運輸過程中受損</li>
                <li>樂器應放置在堅固的硬殼箱中，並鬆弛琴弦以減少壓力</li>
                <li>寵物運輸需提前48小時申請，並提供相關健康證明和疫苗接種證明</li>
                <li>重大行李（超過32公斤）需採用特殊處理程序，可能產生額外費用</li>
                <li>部分航線上可能無法接受某些特殊行李，請提前確認</li>
              </ul>
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">殘障人士輔助設備</h3>
              <p className="text-gray-600">
                輪椅、拐杖等醫療輔助設備可免費運輸，不計入行李限額。電動輪椅需要提前申報電池類型，並可能需要特別處理。
              </p>
            </div>
          </div>
        );
      case 'fees':
        return (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                超出免費行李限額的行李將產生額外費用。以下是各艙等超額行李的收費標準。
              </p>
              <CurrencySelector />
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      超額類型
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      經濟艙
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      商務艙
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      頭等艙
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {excessBaggageFees.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.weight}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.economy === 0 ? '免費' : formatPrice(item.economy)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.business === 0 ? '免費' : formatPrice(item.business)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.first === 0 ? '免費' : formatPrice(item.first)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">其他費用注意事項</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>會員身份可能會影響超額行李的收費標準</li>
                <li>提前在網上購買超額行李服務比在機場付費要便宜約15%</li>
                <li>費用將以始發地貨幣或等值金額收取</li>
                <li>不同航線可能會有特殊的行李收費標準，詳情請查詢具體航線</li>
                <li>費用標準可能會不時調整，最終以預訂時的價格為準</li>
              </ul>
            </div>
            
            <div className="mt-8 bg-ya-yellow-50 border-l-4 border-ya-yellow-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-ya-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-ya-yellow-700">
                    提示：提前在網上預訂超額行李服務可節省費用，並避免在機場辦理時的繁瑣手續。
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                首頁
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-gray-900 font-medium">行李規定</span>
            </li>
          </ol>
        </nav>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">行李規定</h1>
        <p className="mt-2 text-lg text-gray-600">了解黃色航空的行李政策和相關規定，輕鬆規劃您的旅程。</p>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-ya-yellow-500 text-ya-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">還有疑問？</h2>
        <p className="text-gray-600 mb-6">
          如果您對行李規定有任何疑問，請隨時聯繫我們的客服團隊。我們會很樂意為您提供協助。
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-ya-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">電子郵件</h3>
              <p className="text-gray-600">baggage@yellowairlines.com</p>
              <p className="text-sm text-gray-500">我們會在24小時內回覆您的郵件</p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-ya-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">電話</h3>
              <p className="text-gray-600">+86 181 2231 7910</p>
              <p className="text-sm text-gray-500">週一至週日 9:00-21:00（當地時間）</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 