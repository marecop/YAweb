'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { FaChevronLeft, FaPlane, FaHotel, FaCar, FaTicketAlt, FaUtensils, FaShoppingBag, FaSearch } from 'react-icons/fa';

export default function RedemptionPage() {
  const router = useRouter();
  const {isLoggedIn, user, loading} = useAuth();
  const [milesBalance, setMilesBalance] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [redemptionItems, setRedemptionItems] = useState<any[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  
  // 從本地存儲載入示例數據
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 僅當認證完成時才繼續
    if (loading) return;
    
    // 如果未登錄，重定向到登錄頁面
    if (!loading && !isLoggedIn) {
      router.push('/auth/login?redirect=/member/redemption');
      return;
    }
    
    const loadRedemptionData = async () => {
      setItemsLoading(true);
      try {
        // 模擬從API獲取數據
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 設置里程餘額
        setMilesBalance(35680);
        
        // 示例兌換項目
        const items = [
          {
            id: 'red-001',
            title: '台北 - 東京 經濟艙單程機票',
            category: 'flight',
            image: '/images/redemptions/flight-tokyo.jpg',
            miles: 15000,
            value: 'NT$8,500',
            featured: true,
            isAvailable: true
          },
          {
            id: 'red-002',
            title: '台北 - 香港 經濟艙單程機票',
            category: 'flight',
            image: '/images/redemptions/flight-hongkong.jpg',
            miles: 10000,
            value: 'NT$5,500',
            featured: false,
            isAvailable: true
          },
          {
            id: 'red-003',
            title: '台北 - 新加坡 經濟艙單程機票',
            category: 'flight',
            image: '/images/redemptions/flight-singapore.jpg',
            miles: 20000,
            value: 'NT$10,500',
            featured: false,
            isAvailable: true
          },
          {
            id: 'red-004',
            title: '機上餐點升級',
            category: 'inflight',
            image: '/images/redemptions/meal-upgrade.jpg',
            miles: 2000,
            value: 'NT$800',
            featured: false,
            isAvailable: true
          },
          {
            id: 'red-005',
            title: '台北桃園機場貴賓室使用券',
            category: 'airport',
            image: '/images/redemptions/lounge-access.jpg',
            miles: 5000,
            value: 'NT$1,200',
            featured: true,
            isAvailable: true
          },
          {
            id: 'red-006',
            title: '額外行李額度 (10公斤)',
            category: 'airport',
            image: '/images/redemptions/extra-baggage.jpg',
            miles: 3000,
            value: 'NT$1,500',
            featured: false,
            isAvailable: true
          },
          {
            id: 'red-007',
            title: '台北文華東方酒店住宿券',
            category: 'hotel',
            image: '/images/redemptions/hotel-voucher.jpg',
            miles: 30000,
            value: 'NT$15,000',
            featured: true,
            isAvailable: true
          },
          {
            id: 'red-008',
            title: '台北 - 洛杉磯 商務艙升級券',
            category: 'upgrade',
            image: '/images/redemptions/business-upgrade.jpg',
            miles: 40000,
            value: 'NT$25,000',
            featured: false,
            isAvailable: false
          }
        ];
        
        setRedemptionItems(items);
      } catch (error) {
        console.error('加載兌換中心數據時出錯:', error);
      } finally {
        setItemsLoading(false);
      }
    };
    
    loadRedemptionData();
  }, [loading, isLoggedIn, user, router]);
  
  // 過濾兌換項目
  const filteredItems = redemptionItems.filter(item => {
    // 類別過濾
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    
    // 搜索過濾
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // 獲取類別標籤
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'flight': return '機票';
      case 'hotel': return '酒店';
      case 'upgrade': return '艙等升級';
      case 'airport': return '機場服務';
      case 'inflight': return '機上服務';
      default: return '其他';
    }
  };
  
  // 獲取類別圖標
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'flight': return <FaPlane className="mr-2" />;
      case 'hotel': return <FaHotel className="mr-2" />;
      case 'car': return <FaCar className="mr-2" />;
      case 'ticket': return <FaTicketAlt className="mr-2" />;
      case 'restaurant': return <FaUtensils className="mr-2" />;
      case 'shopping': return <FaShoppingBag className="mr-2" />;
      default: return null;
    }
  };
  
  // 處理兌換動作
  const handleRedeem = (itemId: string) => {
    const item = redemptionItems.find(i => i.id === itemId);
    if (!item) return;
    
    if (item.miles > milesBalance) {
      alert('您的里程不足，無法兌換此項目');
      return;
    }
    
    if (!item.isAvailable) {
      alert('此項目目前不可兌換');
      return;
    }
    
    if (window.confirm(`確定要兌換 ${item.title} 嗎？將消耗 ${item.miles.toLocaleString()} 里程。`)) {
      alert('兌換成功！您將在 3 個工作日內收到兌換確認郵件。');
    }
  };
  
  // 如果認證正在加載，顯示加載中
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ya-yellow-500"></div>
        <span className="ml-3 text-lg text-gray-700">驗證身份中...</span>
      </div>
    );
  }
  
  // 如果未登入，顯示登入提示（通常不會到這裡，因為會被重定向）
  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">請先登入</h2>
          <p className="text-gray-600 mb-8">您需要登入才能訪問兌換中心。</p>
          <button
            onClick={() => router.push('/auth/login?redirect=/member/redemption')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500"
          >
            前往登入
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 返回會員中心 */}
      <div className="mb-6">
        <Link href="/member" className="inline-flex items-center text-gray-600 hover:text-ya-yellow-600">
          <FaChevronLeft className="mr-1" /> 返回會員中心
        </Link>
      </div>
      
      {/* 頁面標題與里程餘額 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">兌換中心</h1>
          <p className="mt-2 text-lg text-gray-600">
            使用您的里程兌換機票、升級和更多獎勵
          </p>
        </div>
        <div className="mt-4 md:mt-0 bg-ya-yellow-50 px-4 py-3 rounded-lg">
          <p className="text-gray-700">您的里程餘額</p>
          <p className="text-2xl font-bold text-ya-yellow-600">{milesBalance.toLocaleString()}</p>
        </div>
      </div>
      
      {/* 搜索和過濾 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm"
                placeholder="搜索兌換項目"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${selectedCategory === 'all' ? 'bg-ya-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setSelectedCategory('all')}
              >
                全部
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${selectedCategory === 'flight' ? 'bg-ya-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setSelectedCategory('flight')}
              >
                機票
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${selectedCategory === 'upgrade' ? 'bg-ya-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setSelectedCategory('upgrade')}
              >
                艙等升級
              </button>
              <button
                className={`hidden md:block px-4 py-2 rounded-md text-sm font-medium ${selectedCategory === 'airport' ? 'bg-ya-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setSelectedCategory('airport')}
              >
                機場服務
              </button>
              <button
                className={`hidden md:block px-4 py-2 rounded-md text-sm font-medium ${selectedCategory === 'hotel' ? 'bg-ya-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setSelectedCategory('hotel')}
              >
                酒店
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 精選項目 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">精選兌換項目</h2>
        
        {itemsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ya-yellow-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {redemptionItems
              .filter(item => item.featured)
              .map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 w-full relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          估值: {item.value}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.isAvailable ? '可兌換' : '暫不可用'}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-xl font-bold text-ya-yellow-600">{item.miles.toLocaleString()} 里程</div>
                      <button
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleRedeem(item.id)}
                        disabled={item.miles > milesBalance || !item.isAvailable}
                      >
                        兌換
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      
      {/* 所有項目 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">所有兌換項目</h2>
        
        {itemsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ya-yellow-500"></div>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                <div className="h-40 w-full relative">
                  <div className="absolute top-0 left-0 w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
                    {item.category}
                  </div>
                  <div className="absolute top-0 left-0 m-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-ya-yellow-100 text-ya-yellow-800">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    估值: {item.value}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-ya-yellow-600">{item.miles.toLocaleString()} 里程</div>
                    <button
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleRedeem(item.id)}
                      disabled={item.miles > milesBalance || !item.isAvailable}
                    >
                      {item.miles > milesBalance ? '里程不足' : '兌換'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500">沒有找到符合條件的兌換項目</p>
          </div>
        )}
      </div>
    </div>
  );
} 