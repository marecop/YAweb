import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { users } from '@/data/users';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 找尋使用者
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { error: '使用者不存在' },
        { status: 401 }
      );
    }

    // 簡單密碼檢查 (實際應用應使用加密比較)
    if (user.password !== password) {
      return NextResponse.json(
        { error: '密碼錯誤' },
        { status: 401 }
      );
    }

    // 設置 cookie 來模擬身份驗證狀態
    cookies().set('auth-token', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 一週
      path: '/',
    });

    // 返回使用者資訊 (排除密碼)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: '登入成功',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('登入錯誤', error);
    return NextResponse.json(
      { error: '登入過程發生錯誤' },
      { status: 500 }
    );
  }
}