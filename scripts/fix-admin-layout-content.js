const fs = require('fs');
const path = require('path');

// 修復admin/layout.tsx文件中的AuthContext類型問題
function fixAdminLayoutContent() {
  try {
    console.log('開始全面修復 admin/layout.tsx 文件...');
    
    // 1. 獲取文件路徑
    const adminLayoutPath = path.join(process.cwd(), 'app/admin/layout.tsx');
    
    // 確保文件存在
    if (!fs.existsSync(adminLayoutPath)) {
      console.error('找不到 admin/layout.tsx 文件');
      return;
    }
    
    // 2. 完整替換文件內容
    const newContent = `'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import Link from 'next/link';
import { MdMenu, MdClose } from 'react-icons/md';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoggedIn, user, isLoading, logout } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (!isLoading) {
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
    }
  }, [isLoading, isLoggedIn, user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // 顯示加載中
  if (isLoading) {
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
        className={\`\${
          showMobileMenu ? 'fixed inset-0 z-30 top-16 pt-4' : 'hidden lg:block'
        } lg:relative lg:top-0 w-64 bg-white shadow-xl\`}
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
`;
    
    // 寫入新內容
    fs.writeFileSync(adminLayoutPath, newContent);
    console.log('✅ admin/layout.tsx 內容已完全替換');
    
    // 3. 清理建構快取以確保下次建構時使用最新的檔案
    const nextCachePath = path.join(process.cwd(), '.next');
    if (fs.existsSync(nextCachePath)) {
      console.log('清理 .next 快取...');
      try {
        fs.rmSync(nextCachePath, { recursive: true, force: true });
        console.log('✅ .next 快取已清理');
      } catch (error) {
        console.error('清理快取時發生錯誤:', error);
      }
    }
    
    console.log('全面修復完成');
  } catch (error) {
    console.error('修復過程中發生錯誤:', error);
  }
}

// 執行修復
fixAdminLayoutContent(); 