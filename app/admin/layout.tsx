'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import Link from 'next/link';
import { MdMenu, MdClose } from 'react-icons/md';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoggedIn, user, loading, logout } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        // 未登入，重定向到登入頁
        router.push('/auth/login?redirect=/admin');
        return;
      }

      if (user && user.role === 'admin') {
        setIsAuthorized(true);
      } else {
        // 無權限，重定向到首頁
        router.push('/');
      }

      setIsLoading(false);
    }
  }, [loading, isLoggedIn, user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // 顯示加載中
  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 pt-16">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 如果無權限，不顯示任何內容
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 pt-16">
      {/* 移動版選單按鈕 */}
      <button
        className="lg:hidden fixed top-20 left-4 z-40 bg-yellow-500 text-white p-2 rounded-md"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* 側邊欄 */}
      <div
        className={`${
          showMobileMenu ? 'fixed inset-0 z-30 top-16 pt-4' : 'hidden lg:block'
        } lg:relative lg:top-0 w-64 bg-white shadow-xl`}
      >
        <div className="flex flex-col h-full">
          <div className="py-6 px-4 bg-yellow-500 text-white">
            <h1 className="text-xl font-bold">黃色航空管理系統</h1>
            <div className="mt-2 text-sm">
              {user?.firstName} {user?.lastName}
            </div>
          </div>

          <AdminSidebar onClose={() => setShowMobileMenu(false)} />

          <div className="mt-auto p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center justify-center"
            >
              登出
            </button>
          </div>
        </div>
      </div>

      {/* 主要內容區 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
} 