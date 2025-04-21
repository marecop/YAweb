import { NextRequest, NextResponse } from 'next/server';
import { 
  verifyUser, 
  createSession, 
  getUserById
} from '@/app/lib/db';

// 用戶登入
export async function POST(request: NextRequest) {
  try {
    console.log('收到登入請求');
    const data = await request.json();
    const { email, password } = data;
    console.log('登入嘗試 - 電子郵件:', email);

    // 檢查是否為預設用戶
    const isDefaultAdmin = email === 'admin@yellairlines.com' && password === 'admin123';
    const isDefaultUser = email === 'test@example.com' && password === 'password123';
    
    let user;
    if (isDefaultAdmin) {
      console.log('使用預設管理員帳戶登入');
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
      console.log('使用預設用戶帳戶登入');
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
      console.log('嘗試從數據庫驗證用戶');
      user = verifyUser(email, password);
    }

    // 驗證用戶
    if (!user) {
      console.log('登入失敗：無效的憑證');
      return NextResponse.json({ 
        success: false,
        error: '電子郵件或密碼不正確' 
      }, { status: 401 });
    }

    console.log('登入成功，用戶ID:', user.id);
    
    // 創建會話
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7天後過期
    const sessionId = createSession(user.id, expiresAt.toISOString());
    console.log('創建會話ID:', sessionId);

    // 從用戶對象中移除密碼，確保管理員自動是會員
    const { password: _, ...userWithoutPassword } = user;
    const userData = {
      ...userWithoutPassword,
      isMember: user.role === 'admin' ? true : !!user.isMember
    };

    // 創建響應
    const response = NextResponse.json({
      success: true,
      authenticated: true,
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

    console.log('登入處理完成，返回響應');
    return response;
  } catch (error) {
    console.error('登入處理過程中發生錯誤:', error);
    return NextResponse.json({ 
      success: false,
      error: '登入處理失敗' 
    }, { status: 500 });
  }
} 