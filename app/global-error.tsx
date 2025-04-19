'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 錯誤發生時記錄到控制台
    console.error('全局錯誤：', error);
  }, [error]);

  return (
    <html lang="zh-TW">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">發生錯誤</h2>
            <p className="text-gray-700 mb-6">抱歉，系統發生異常。請嘗試重新載入頁面。</p>
            <button
              onClick={() => reset()}
              className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
            >
              重試
            </button>
          </div>
        </div>
      </body>
    </html>
  );
} 