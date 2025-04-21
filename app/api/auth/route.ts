import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  getSession, 
  createSession, 
  deleteSession, 
  getUserById, 
  verifyUser, 
  addUser,
  getUserByEmail,
  cleanupExpiredSessions,
  saveUsers,
  updateUser
} from '@/app/lib/db';

// 從cookie字符串中獲取特定cookie值的函數
function getCookie(cookieString: string | null, name: string): string | null {
  if (!cookieString) return null;
  const match = cookieString.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
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
      // 會話已過期
      return NextResponse.json({ authenticated: false, error: '會話已過期' });
    }
    
    // 獲取用戶信息
    const user = getUserById(session.userId);
    
    if (!user) {
      return NextResponse.json({ authenticated: false });
    }
    
    // 移除敏感資訊
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

// 用戶註冊
export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json();
    
    // 驗證請求數據
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: '缺少必要的註冊信息' },
        { status: 400 }
      );
    }
    
    // 密碼長度驗證
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: '密碼必須至少包含6個字符' },
        { status: 400 }
      );
    }
    
    // 電子郵件格式驗證
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: '請提供有效的電子郵件地址' },
        { status: 400 }
      );
    }
    
    // 檢查電子郵件是否已存在
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '此電子郵件已被註冊' },
        { status: 409 }
      );
    }
    
    // 創建新用戶
    const newUser = addUser({
      email,
      password,
      firstName,
      lastName,
      role: 'user',
      isMember: true
    });
    
    if (!newUser) {
      return NextResponse.json(
        { success: false, error: '註冊用戶失敗' },
        { status: 500 }
      );
    }
    
    // 創建會話
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7天後過期
    const sessionId = createSession(newUser.id, expiresAt.toISOString());
    
    // 移除敏感資訊
    const { password: _, ...userInfo } = newUser;
    
    // 創建響應
    const response = NextResponse.json({
      success: true,
      user: userInfo,
      message: '註冊成功'
    });
    
    // 設置 cookie
    response.cookies.set({
      name: 'sessionId',
      value: sessionId,
      httpOnly: true,
      path: '/',
      expires: expiresAt
    });
    
    return response;
  } catch (error) {
    console.error('註冊失敗:', error);
    return NextResponse.json(
      { success: false, error: '註冊處理時出錯' },
      { status: 500 }
    );
  }
}

// 用戶登入
export async function PUT(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // 驗證請求數據
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: '請提供電子郵件和密碼' },
        { status: 400 }
      );
    }
    
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
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: '電子郵件或密碼不正確' },
        { status: 401 }
      );
    }
    
    // 創建會話
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7天後過期
    const sessionId = createSession(user.id, expiresAt.toISOString());
    
    // 移除敏感資訊
    const { password: _, ...userInfo } = user;
    const userData = {
      ...userInfo,
      isMember: user.role === 'admin' ? true : !!user.isMember
    };
    
    // 創建響應
    const response = NextResponse.json({
      success: true,
      authenticated: true,
      user: userData
    });
    
    // 設置 cookie
    response.cookies.set({
      name: 'sessionId',
      value: sessionId,
      httpOnly: true,
      path: '/',
      expires: expiresAt
    });
    
    return response;
  } catch (error) {
    console.error('登入失敗:', error);
    return NextResponse.json(
      { success: false, error: '登入處理時出錯' },
      { status: 500 }
    );
  }
}

// 用戶登出
export async function DELETE(request: NextRequest) {
  try {
    // 從 cookie 中獲取會話 ID
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (sessionId) {
      // 刪除會話
      deleteSession(sessionId);
    }
    
    // 創建響應
    const response = NextResponse.json({
      success: true,
      message: '已成功登出'
    });
    
    // 清除 cookie
    response.cookies.delete('sessionId');
    
    return response;
  } catch (error) {
    console.error('登出失敗:', error);
    return NextResponse.json(
      { success: false, error: '登出處理時出錯' },
      { status: 500 }
    );
  }
}

// 更新用戶資料
export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    const { userId } = data;

    if (!userId) {
      return NextResponse.json({ error: '未提供用戶ID' }, { status: 400 });
    }

    // 檢查授權
    const sessionId = getCookie(request.headers.get('cookie'), 'sessionId');
    const session = sessionId ? getSession(sessionId) : null;

    if (!session || session.userId !== userId) {
      return NextResponse.json({ error: '未授權的請求' }, { status: 401 });
    }

    // 獲取目前用戶資料
    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: '找不到用戶' }, { status: 404 });
    }

    // 創建一個不包含敏感信息的更新數據物件
    const updateData: any = {};
    
    // 允許更新的字段
    const allowedFields = [
      'firstName', 'lastName', 'dateOfBirth', 'phone', 
      'address', 'country', 'city', 'postalCode'
    ];
    
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    });

    // 更新用戶
    const updatedUser = updateUser(userId, updateData);
    if (!updatedUser) {
      return NextResponse.json({ error: '更新用戶資料失敗' }, { status: 500 });
    }

    // 返回不含敏感信息的用戶資料
    const safeUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      dateOfBirth: updatedUser.dateOfBirth,
      phone: updatedUser.phone,
      address: updatedUser.address,
      country: updatedUser.country,
      city: updatedUser.city,
      postalCode: updatedUser.postalCode,
    };

    return NextResponse.json({
      user: safeUser,
      message: '用戶資料更新成功'
    });
  } catch (error) {
    console.error('更新用戶資料錯誤:', error);
    return NextResponse.json({ error: '更新用戶資料過程中發生錯誤' }, { status: 500 });
  }
} 