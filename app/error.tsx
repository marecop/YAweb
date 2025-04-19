'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 將錯誤上報到日誌或分析服務
    console.error('發生錯誤:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full text-center">
        <svg 
          className="mx-auto h-16 w-16 text-red-500 mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">發生錯誤</h2>
        <p className="text-gray-600 mb-6">
          很抱歉，載入頁面時發生了錯誤。請嘗試重新載入頁面。
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500"
        >
          重試
        </button>
      </div>
    </div>
  )
} 