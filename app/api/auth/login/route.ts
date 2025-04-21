import { NextRequest, NextResponse } from 'next/server';
import { 
  verifyUser, 
  createSession, 
  getUserById
} from '@/app/lib/db';

// 用戶登入
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, password } = data;

    // 檢查是否為預設用戶
    const isDefaultAdmin = email === 'admin@yellairlines.com' && password === 'admin123';
    const isDefaultUser = email === 'test@example.com' && password === 'password123';
    
    let user;
    if (isDefaultAdmin) {
      user = {
        id: 'admin1',
        email: 'admin@yellairlines.com',
        password: 'admin123',
        firstName: '系統',
        lastName: '管理員',
        role: 'admin',
        isMember: true,
        createdAt: new Date().toISOString()
      };
    } else if (isDefaultUser) {
      user = {
        id: '1',
        email: 'test@example.com',
        password: 'password123',
        firstName: '測試',
        lastName: '用戶',
        role: 'user',
        isMember: true,
        createdAt: new Date().toISOString()
      };
    } else {
      // 從數據庫驗證用戶
      user = verifyUser(email, password);
    }

    // 驗證用戶
    if (!user) {
      return NextResponse.json({ error: '電子郵件或密碼不正確' }, { status: 401 });
    }

    // 創建會話
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7天後過期
    const sessionId = createSession(user.id, expiresAt.toISOString());

    // 從用戶對象中移除密碼，確保管理員自動是會員
    const { password: _, ...userWithoutPassword } = user;
    const userData = {
      ...userWithoutPassword,
      isMember: user.role === 'admin' ? true : !!user.isMember
    };

    // 創建響應
    const response = NextResponse.json({
      success: true,
      user: userData
    });

    // 設置cookie
    response.cookies.set({
      name: 'sessionId',
      value: sessionId,
      httpOnly: true,
      path: '/',
      expires: expiresAt
    });

    return response;
  } catch (error) {
    console.error('登入錯誤:', error);
    return NextResponse.json({ error: '登入處理失敗' }, { status: 500 });
  }
} 