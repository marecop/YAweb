'use client'

import { useEffect } from 'react'

export default function ApiError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 將API錯誤上報到日誌服務
    console.error('API路由錯誤:', error)
  }, [error])

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
      <h2 className="text-lg font-semibold mb-2">API錯誤</h2>
      <p className="text-sm mb-3">處理API請求時發生錯誤。</p>
      <button
        onClick={() => reset()}
        className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        重試
      </button>
    </div>
  )
} 