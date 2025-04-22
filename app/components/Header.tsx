'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import CurrencySelector from './CurrencySelector';
import { FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { getMemberLevelName, getMemberLevelColorClass } from '../utils/memberUtils';
import { useCurrency } from '../../contexts/CurrencyContext';
import { User } from '@/app/lib/auth';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('TWD');
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const currencySelectorRef = useRef<HTMLDivElement>(null);
  const { currency, setCurrency } = useCurrency();
  
  // 檢查用戶是否為管理員
  const isUserAdmin = user?.role === 'admin';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('登出時發生錯誤:', error);
    }
  };

  // 顯示用戶名函數，確保在沒有名字時顯示合理的後備值
  const getUserDisplayName = () => {
    if (!user) return '已登入用戶';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    } else {
      return user.email.split('@')[0];
    }
  };

  // 獲取用戶頭像的首字母
  const getUserInitials = () => {
    if (!user) return 'U';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    } else if (user.firstName) {
      return user.firstName[0].toUpperCase();
    } else if (user.lastName) {
      return user.lastName[0].toUpperCase();
    } else if (user.email) {
      return user.email[0].toUpperCase();
    } else {
      return 'U';
    }
  };

  // 點擊用戶名切換下拉選單
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  console.log('Header: 當前認證狀態:', isLoggedIn, '用戶:', user);

  // 更新使用者頭像和名稱的顯示
  const userAvatar = user?.firstName ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ''}` : '遊';
  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}` : '遊客';
  const userRole = user?.role === 'admin' ? '管理員' : '';
  const memberLevel = user?.memberLevel ? getMemberLevelName(String(user.memberLevel)) : '';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logoremovebkgnd.png" 
                  alt="黃色航空標誌"
                  width={50}
                  height={50}
                  className="h-10 w-auto"
                />
                <span className="ml-2 text-gray-800 font-semibold">黃色航空 | Yellow Airlines</span>
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:ml-6 md:flex md:space-x-8 md:items-center">
            <Link href="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-ya-yellow-500 text-sm font-medium text-gray-900">
              首頁
            </Link>
            <Link href="/flights" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              航班搜索
            </Link>
            {isLoggedIn && (
              <Link href="/bookings" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                我的預訂
              </Link>
            )}
            <Link href="/baggage" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              行李規定
            </Link>
            <CurrencySelector className="ml-4" />
          </nav>
          
          {/* 登入與註冊入口 */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {loading ? (
              <div className="h-8 w-16 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-ya-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : isLoggedIn ? (
              <div className="relative">
                <button
                  className="flex items-center text-gray-700 hover:text-ya-yellow-600 focus:outline-none"
                  onClick={toggleUserMenu}
                >
                  <div className="h-8 w-8 rounded-full bg-ya-yellow-500 flex items-center justify-center text-white">
                    {getUserInitials()}
                  </div>
                  <span className="ml-1 text-sm hidden sm:inline-block">{getUserDisplayName()}</span>
                  {user?.memberLevel && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getMemberLevelColorClass(String(user.memberLevel))}`}>
                      {getMemberLevelName(String(user.memberLevel))}
                    </span>
                  )}
                </button>
                
                {/* 用戶選單 */}
                {userMenuOpen && (
                  <div 
                    ref={userMenuRef}
                    className="fixed right-4 top-16 z-[100] mt-1 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
                    <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                      已登入為<br />
                        <span className="font-medium text-gray-900">{user?.email}</span>
                        {user?.isMember && user?.memberLevel && (
                          <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getMemberLevelColorClass(String(user.memberLevel))}`}>
                            {getMemberLevelName(String(user.memberLevel))}
                          </div>
                        )}
                    </div>
                    
                    <Link 
                      href="/member" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      會員中心
                    </Link>
                    
                    {isUserAdmin && (
                      <Link 
                        href="/admin" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        管理後台
                      </Link>
                    )}
                    
                    <Link 
                      href="/member/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      設定
                    </Link>
                    
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      登出
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  登入
                </Link>
                <Link href="/auth/register" className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ya-yellow-500 hover:bg-ya-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500">
                  註冊
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-expanded="false"
            >
              <span className="sr-only">打開主菜單</span>
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/" className="block pl-3 pr-4 py-2 border-l-4 border-ya-yellow-500 text-base font-medium text-gray-900 bg-gray-50">
            首頁
          </Link>
          <Link href="/flights" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
            航班搜索
          </Link>
          {isLoggedIn && (
            <Link href="/bookings" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
              我的預訂
            </Link>
          )}
          <Link href="/baggage" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
            行李規定
          </Link>
          
          <div className="px-3 py-2 border-l-4 border-transparent">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">貨幣:</span>
              <CurrencySelector compact={true} />
            </div>
          </div>
          
          {/* 移動端登入與註冊入口 */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {loading ? (
              <div className="px-4 py-2 flex justify-center">
                <svg className="animate-spin h-5 w-5 text-ya-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : isLoggedIn ? (
              <div className="px-4 space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {getUserInitials()}
                  </div>
                  <div className="text-base font-medium text-gray-700">
                    {getUserDisplayName()}
                  </div>
                </div>
                <div className="space-y-1 mt-3">
                  <Link href="/member" className="block px-2 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md">
                    會員中心
                  </Link>
                  <Link href="/member/miles" className="block px-2 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md">
                    我的里程
                  </Link>
                  <Link href="/member/redemption" className="block px-2 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md">
                    兌換中心
                  </Link>
                  <Link href="/member/settings" className="block px-2 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md">
                    帳戶設置
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-2 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md"
                  >
                    登出
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center px-4 space-x-3">
                <Link href="/auth/login" className="block text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50">
                  登入
                </Link>
                <Link href="/auth/register" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-ya-yellow-500 hover:bg-ya-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500">
                  註冊
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 