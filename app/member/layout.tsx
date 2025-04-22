'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import MemberSidebar from '@/app/components/MemberSidebar';
import Link from 'next/link';

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const { isLoggedIn, loading, user } = useAuth();
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);

  useEffect(() => {
    // 檢查用戶是否已登入
    if (!loading && !isLoggedIn) {
      router.push('/auth/login?redirect=/member');
      return;
    }

    // 檢查是否是會員
    if (!loading && isLoggedIn && user && !user.isMember) {
      setShowRegisterPrompt(true);
    } else {
      setShowRegisterPrompt(false);
    }
  }, [loading, isLoggedIn, user, router]);

  // 如果正在加載，顯示加載中畫面
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showRegisterPrompt ? (
          // 會員註冊提示
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">註冊成為會員</h2>
            <p className="mb-6 text-gray-600">
              您尚未完成會員註冊，註冊會員後即可使用里程累積和兌換、專屬優惠等功能。
            </p>
            <Link 
              href="/member/register" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              立即註冊會員
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <MemberSidebar />
            </div>
            <div className="md:w-3/4">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 