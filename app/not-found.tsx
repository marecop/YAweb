import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-5xl font-bold text-ya-yellow-500 mb-3">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">頁面未找到</h2>
        <p className="text-gray-600 mb-6">
          您訪問的頁面不存在或已被移除。
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-ya-yellow-600 hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ya-yellow-500"
        >
          返回首頁
        </Link>
      </div>
    </div>
  )
} 