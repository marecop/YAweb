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
  // 清理過期會話
  cleanupExpiredSessions();
  
  try {
    // 從 cookie 中獲取會話 ID
    const sessionId = request.cookies.get('yellairlines_session')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ authenticated: false });
    }
    
    // 從數據庫獲取會話信息
    const sessionInfo = getSession(sessionId);
    
    if (!sessionInfo) {
      return NextResponse.json({ authenticated: false });
    }
    
    // 獲取用戶信息
    const user = getUserById(sessionInfo.userId);
    
    if (!user) {
      return NextResponse.json({ authenticated: false });
    }
    
    // 返回用戶信息，但不包含密碼
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      authenticated: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('檢查身份驗證失敗:', error);
    return NextResponse.json(
      { authenticated: false, error: '檢查身份驗證狀態時出錯' },
      { status: 500 }
    );
  }
}

// 用戶登入
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, password } = data;

    // 驗證用戶
    const user = verifyUser(email, password);
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

// 用戶註冊
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, password, firstName, lastName } = data;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: '請提供所有必要的用戶信息' }, { status: 400 });
    }

    // 檢查郵箱是否已存在
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: '此電子郵件已被註冊' }, { status: 409 });
    }

    // 添加新用戶
    const newUser = addUser({
      email,
      password,
      firstName,
      lastName,
      role: 'user',
      isMember: false,
    });

    if (!newUser) {
      return NextResponse.json({ error: '註冊失敗，請稍後再試' }, { status: 500 });
    }

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
      message: '註冊成功'
    });
  } catch (error) {
    console.error('註冊錯誤:', error);
    return NextResponse.json({ error: '註冊過程中發生錯誤' }, { status: 500 });
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

// 用戶登出
export async function DELETE(request: NextRequest) {
  try {
    const sessionId = getCookie(request.headers.get('cookie'), 'sessionId');
    if (!sessionId) {
      return NextResponse.json({ message: '已登出' });
    }

    // 刪除會話
    deleteSession(sessionId);
    
    // 創建響應並清除 cookie
    const response = NextResponse.json({ message: '登出成功' });
    response.cookies.set({
      name: 'sessionId',
      value: '',
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('登出錯誤:', error);
    return NextResponse.json({ error: '登出過程中發生錯誤' }, { status: 500 });
  }
} 