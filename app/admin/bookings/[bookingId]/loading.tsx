import React from 'react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-ya-yellow-500"></div>
      <span className="ml-4 text-xl text-gray-700">載入預訂詳情中...</span>
    </div>
  );
} 