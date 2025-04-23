'use client';

import React from 'react';
import Link from 'next/link';
import { MdDashboard, MdPerson, MdFlight, MdCardMembership, MdAttachMoney, MdHistory, MdEventNote } from 'react-icons/md';

export default function AdminDashboard() {
  const dashboardItems = [
    {
      title: '會員管理',
      icon: <MdPerson className="h-8 w-8 text-blue-600" />,
      description: '管理用戶資料、里程和等級',
      link: '/admin/users',
      color: 'bg-blue-100',
      subItems: [
        {
          title: '會員等級',
          icon: <MdCardMembership className="h-5 w-5" />,
          link: '/admin/users/levels',
        },
        {
          title: '用戶里程',
          icon: <MdAttachMoney className="h-5 w-5" />,
          link: '/admin/users/miles',
        },
        {
          title: '里程歷史',
          icon: <MdHistory className="h-5 w-5" />,
          link: '/admin/users/miles/history',
        }
      ]
    },
    {
      title: '航班管理',
      icon: <MdFlight className="h-8 w-8 text-green-600" />,
      description: '管理航班資訊和排程',
      link: '/admin/flights',
      color: 'bg-green-100'
    },
    {
      title: '預訂管理',
      icon: <MdEventNote className="h-8 w-8 text-purple-600" />,
      description: '管理所有航班預訂和訂單',
      link: '/admin/bookings',
      color: 'bg-purple-100'
    }
  ];

  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">管理系統儀表板</h1>
        <p className="text-gray-600">
          歡迎使用黃色航空管理系統。在此管理所有與航空相關的運營資訊。
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardItems.map((item) => (
          <div key={item.title} className={`${item.color} p-6 rounded-lg shadow-sm`}>
            <Link href={item.link}>
              <div className="flex flex-col items-center text-center mb-4">
                <div className="mb-4">
                  {item.icon}
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h2>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </Link>
            
            {item.subItems && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-md font-medium text-gray-700 mb-2">快速訪問</h3>
                <div className="grid grid-cols-1 gap-2">
                  {item.subItems.map((subItem) => (
                    <Link 
                      key={subItem.link} 
                      href={subItem.link}
                      className="flex items-center p-2 rounded-md hover:bg-white/50 transition-colors"
                    >
                      <span className="mr-2">{subItem.icon}</span>
                      <span className="text-sm">{subItem.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">系統資訊</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="text-sm text-gray-500">系統版本</div>
            <div className="text-lg font-medium text-gray-900">1.0.0</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="text-sm text-gray-500">最後更新</div>
            <div className="text-lg font-medium text-gray-900">{new Date().toLocaleDateString('zh-TW')}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="text-sm text-gray-500">管理員數量</div>
            <div className="text-lg font-medium text-gray-900">1</div>
          </div>
        </div>
      </div>
    </div>
  );
} 