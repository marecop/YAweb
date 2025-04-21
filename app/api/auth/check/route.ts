import { NextRequest, NextResponse } from 'next/server';
import { getUserById, getSession } from '@/app/lib/db';

// 獲取預設用戶資料
function getDefaultUser(userId: string) {
  if (userId === 'admin1') {
    return {
      id: 'admin1',
      email: 'admin@yellairlines.com',
      password: 'admin123',
      firstName: '系統',
      lastName: '管理員',
      role: 'admin',
      isMember: true,
      createdAt: new Date().toISOString()
    };
  } else if (userId === '1') {
    return {
      id: '1',
      email: 'test@example.com',
      password: 'password123',
      firstName: '測試',
      lastName: '用戶',
      role: 'user',
      isMember: true,
      createdAt: new Date().toISOString()
    };
  }
  return null;
}

// 檢查用戶身份驗證狀態
export async function GET(request: NextRequest) {
  try {
    // 從 cookie 中獲取會話 ID
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ authenticated: false });
    }
    
    // 從數據庫獲取會話信息
    const session = getSession(sessionId);
    
    if (!session) {
      return NextResponse.json({ authenticated: false });
    }
    
    // 檢查會話是否過期
    const expiryDate = new Date(session.expires);
    if (expiryDate < new Date()) {
      return NextResponse.json({ authenticated: false, error: '會話已過期' });
    }
    
    // 優先檢查是否為預設用戶
    let user = null;
    if (session.userId === 'admin1' || session.userId === '1') {
      user = getDefaultUser(session.userId);
    } else {
      // 從數據庫獲取用戶信息
      user = getUserById(session.userId);
    }
    
    if (!user) {
      return NextResponse.json({ authenticated: false });
    }
    
    // 移除敏感資訊，確保管理員自動被標記為會員
    const { password, ...userInfo } = user;
    const userData = {
      ...userInfo,
      isMember: user.role === 'admin' ? true : !!user.isMember
    };
    
    return NextResponse.json({
      authenticated: true,
      user: userData
    });
  } catch (error) {
    console.error('檢查身份驗證失敗:', error);
    return NextResponse.json(
      { authenticated: false, error: '檢查身份驗證狀態時出錯' },
      { status: 500 }
    );
  }
} 