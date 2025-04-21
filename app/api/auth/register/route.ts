import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import UserModel, { IUser } from '@/app/models/User';
import SessionModel from '@/app/models/Session';

export async function POST(request: Request) {
  try {
    // 連接到MongoDB
    await connectToDatabase();
    
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
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: '此電子郵件已被註冊' },
        { status: 409 }
      );
    }

    // 創建新用戶
    const newUser = new UserModel({
      email,
      password,
      firstName: firstName || email.split('@')[0],
      lastName: lastName || 'User',
      role: 'user',
      isMember: true
    });

    // 保存用戶 (密碼將通過中間件自動加密)
    await newUser.save();

    // 獲取用戶ID (確保類型正確)
    const userId = newUser._id ? newUser._id.toString() : '';

    // 創建會話
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7天後過期
    const session = await SessionModel.createSession(userId, expiresAt);
    
    // 移除敏感資訊
    const userData = newUser.toObject();
    const { password: _, ...userWithoutPassword } = userData;
    
    // 創建響應
    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: '註冊成功'
    });
    
    // 設置 cookie
    response.cookies.set({
      name: 'sessionToken',
      value: session.token,
      httpOnly: true,
      path: '/',
      expires: expiresAt
    });
    
    return response;
  } catch (error) {
    console.error('註冊錯誤:', error);
    return NextResponse.json(
      { error: '伺服器錯誤，請稍後再試' },
      { status: 500 }
    );
  }
} 