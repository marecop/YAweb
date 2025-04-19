export default function FlightDetailsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 頁面標題骨架 */}
      <div className="mb-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>
      </div>
      
      {/* 航班詳情卡片骨架 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg animate-pulse mb-8">
        <div className="px-4 py-5 sm:px-6">
          <div className="h-7 bg-gray-200 rounded w-48 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div>
              <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded w-full"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
            
            <div>
              <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded w-full"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 乘客信息骨架 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg animate-pulse mb-8">
        <div className="px-4 py-5 sm:px-6">
          <div className="h-6 bg-gray-200 rounded w-40 mb-3"></div>
        </div>
        
        <div className="border-t border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
            
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 按鈕骨架 */}
      <div className="flex justify-center animate-pulse">
        <div className="h-12 bg-gray-200 rounded w-48"></div>
      </div>
    </div>
  );
} 