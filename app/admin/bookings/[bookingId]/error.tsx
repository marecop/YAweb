'use client';

import React from 'react';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-red-100 p-4 mb-4">
            <FaExclamationTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">出錯了</h1>
          <p className="text-gray-600 mb-6">
            {error.message || '載入預訂詳情時發生錯誤'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => reset()}
              className="bg-ya-yellow-500 hover:bg-ya-yellow-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center"
            >
              重試
            </button>
            <Link 
              href="/admin/bookings"
              className="bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-300 flex items-center justify-center"
            >
              <FaArrowLeft className="mr-2" />
              返回預訂列表
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 