import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { users } from '@/data/users';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // 檢查使用者是否已存在
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: '使用者已存在' },
        { status: 400 }
      );
    }

    // 創建新使用者 (實際應用會存入資料庫)
    const newUserId = `user_${Date.now()}`;
    const newUser = {
      id: newUserId,
      firstName,
      lastName,
      email,
      password, // 實際應用應加密儲存
      miles: 0,
      level: 'Blue' as 'Blue' | 'Silver' | 'Gold' | 'Platinum',
    };

    // 將新使用者加入模擬資料 (實際應用會存入資料庫)
    users.push(newUser);

    // 設置 cookie 來模擬身份驗證狀態
    cookies().set('auth-token', newUserId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 一週
      path: '/',
    });

    // 返回使用者資訊 (排除密碼)
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      message: '註冊成功',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('註冊錯誤', error);
    return NextResponse.json(
      { error: '註冊過程發生錯誤' },
      { status: 500 }
    );
  }
}