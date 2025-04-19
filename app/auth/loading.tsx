export default function AuthLoading() {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <div className="bg-white p-8 rounded-lg shadow-md animate-pulse">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        </div>
        
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
        
        <div className="space-y-6">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        
        <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto mt-6"></div>
      </div>
    </div>
  );
} 