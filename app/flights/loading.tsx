export default function FlightsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">航班搜索結果</h1>
      
      {/* 搜索摘要骨架 */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8 animate-pulse">
        <div className="flex flex-wrap items-center justify-between">
          <div className="mb-2 md:mb-0 w-3/4">
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="flex items-center space-x-4 w-1/4">
            <div className="h-8 bg-gray-200 rounded-full w-full"></div>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 過濾面板骨架 */}
        <div className="lg:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-6"></div>
            
            <div className="space-y-8">
              <div>
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
              
              <div>
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
              
              <div>
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-24 bg-gray-200 rounded w-full"></div>
              </div>
              
              <div>
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-16 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 航班列表骨架 */}
        <div className="lg:w-3/4">
          <div className="bg-white p-4 rounded-lg shadow-md mb-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-5 bg-gray-200 rounded w-32"></div>
              <div className="h-8 bg-gray-200 rounded w-40"></div>
            </div>
          </div>
          
          {/* 航班卡片骨架 */}
          {[1, 2, 3].map((index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden mb-4 animate-pulse">
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="w-12 h-12 bg-gray-200 rounded-md mr-4"></div>
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className="flex items-center mb-6 md:mb-0">
                    <div className="text-center mr-10">
                      <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-10 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    
                    <div className="flex flex-col items-center mx-6">
                      <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="relative w-24 md:w-40 h-1 bg-gray-200 rounded"></div>
                    </div>
                    
                    <div className="text-center ml-10">
                      <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-10 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  
                  <div className="h-10 bg-gray-200 rounded w-28"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 