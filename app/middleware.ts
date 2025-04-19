import { NextRequest, NextResponse } from 'next/server';

// 需要登入才能訪問的頁面路徑
const protectedRoutes = [
  '/bookings',
  '/profile',
  '/payment',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 檢查是否為受保護路徑
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isProtectedRoute) {
    // 檢查是否已登入（查看會話cookie）
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (!sessionId) {
      // 未登入，重定向到登入頁面，並保存嘗試訪問的URL
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// 配置哪些路徑應該觸發中間件
export const config = {
  matcher: [
    '/bookings/:path*',
    '/profile/:path*',
    '/payment/:path*',
  ],
}; 