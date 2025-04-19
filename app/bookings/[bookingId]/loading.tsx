export default function BookingDetailsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between animate-pulse">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg animate-pulse">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <div className="h-7 bg-gray-200 rounded w-48 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="h-5 bg-gray-200 rounded w-24"></div>
              <div className="mt-1 h-5 bg-gray-200 rounded sm:mt-0 sm:col-span-2 w-64"></div>
            </div>
            
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="h-5 bg-gray-200 rounded w-24"></div>
              <div className="mt-1 sm:mt-0 sm:col-span-2 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-32"></div>
                <div className="h-5 bg-gray-200 rounded w-48"></div>
                <div className="h-5 bg-gray-200 rounded w-64"></div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="h-5 bg-gray-200 rounded w-24"></div>
              <div className="mt-1 sm:mt-0 sm:col-span-2 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-32"></div>
                <div className="h-5 bg-gray-200 rounded w-48"></div>
                <div className="h-5 bg-gray-200 rounded w-64"></div>
              </div>
            </div>
            
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="h-5 bg-gray-200 rounded w-24"></div>
              <div className="mt-1 h-5 bg-gray-200 rounded sm:mt-0 sm:col-span-2 w-32"></div>
            </div>
            
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="h-5 bg-gray-200 rounded w-24"></div>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="h-32 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </dl>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-48"></div>
      </div>
    </div>
  );
} 