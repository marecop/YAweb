'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaUser, 
  FaTicketAlt, 
  FaPlane, 
  FaExchangeAlt, 
  FaCreditCard, 
  FaCog, 
  FaBell 
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

// 側邊欄項目接口
interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  requiresMembership?: boolean;
}

export default function MemberSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  // 側邊欄項目
  const sidebarItems: SidebarItem[] = [
    {
      title: '會員資料',
      icon: <FaUser className="w-5 h-5" />,
      href: '/member',
    },
    {
      title: '我的訂位',
      icon: <FaTicketAlt className="w-5 h-5" />,
      href: '/member/bookings',
    },
    {
      title: '我的航班',
      icon: <FaPlane className="w-5 h-5" />,
      href: '/member/flights',
    },
    {
      title: '我的里程',
      icon: <FaExchangeAlt className="w-5 h-5" />,
      href: '/member/miles',
      requiresMembership: true,
    },
    {
      title: '我的優惠券',
      icon: <FaCreditCard className="w-5 h-5" />,
      href: '/member/coupons',
      requiresMembership: true,
    },
    {
      title: '個人設定',
      icon: <FaCog className="w-5 h-5" />,
      href: '/member/settings',
    },
    {
      title: '通知中心',
      icon: <FaBell className="w-5 h-5" />,
      href: '/member/notifications',
    },
  ];

  // 檢查當前路徑是否為活動項目
  const isActive = (href: string) => {
    if (href === '/member' && pathname === '/member') {
      return true;
    }
    return pathname.startsWith(href) && href !== '/member';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-100">
        <h2 className="text-lg font-semibold text-gray-900">會員中心</h2>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            // 檢查是否需要會員身份
            if (item.requiresMembership && user && !user.isMember) {
              return (
                <li key={item.href} className="opacity-50">
                  <span className="flex items-center px-4 py-2 text-sm text-gray-400 rounded-md cursor-not-allowed">
                    <span className="mr-3">{item.icon}</span>
                    {item.title}
                    <span className="ml-2 text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                      需註冊
                    </span>
                  </span>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-yellow-500 text-white font-medium'
                      : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-600'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
} 