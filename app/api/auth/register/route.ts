import { NextResponse } from 'next/server';
import { addUser, getUserByEmail } from '@/app/lib/db';

// 模擬用戶數據庫
let users = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    memberLevel: 3,
    isMember: true
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    firstName: 'Normal',
    lastName: 'User',
    role: 'user',
    memberLevel: 1,
    isMember: true
  }
];

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    // 簡單的驗證
    if (!email || !password) {
      return NextResponse.json(
        { error: '請提供電子郵件和密碼' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '密碼必須至少包含6個字符' },
        { status: 400 }
      );
    }

    // 檢查電子郵件格式
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '請提供有效的電子郵件地址' },
        { status: 400 }
      );
    }

    // 檢查電子郵件是否已存在
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: '此電子郵件已被註冊' },
        { status: 409 }
      );
    }

    // 創建新用戶
    const newUser = addUser({
      email,
      password,
      firstName: firstName || email.split('@')[0],
      lastName: lastName || 'User',
      role: 'user',
      isMember: true
    });

    if (!newUser) {
      return NextResponse.json(
        { error: '註冊用戶失敗' },
        { status: 500 }
      );
    }

    // 創建用戶資料 (移除密碼)
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      user: userWithoutPassword,
      message: '註冊成功'
    });
  } catch (error) {
    console.error('註冊錯誤:', error);
    return NextResponse.json(
      { error: '伺服器錯誤，請稍後再試' },
      { status: 500 }
    );
  }
} 