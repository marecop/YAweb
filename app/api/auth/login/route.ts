import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import UserModel from '@/app/models/User';
import SessionModel from '@/app/models/Session';

// 用戶登入
export async function POST(request: NextRequest) {
  try {
    // 連接到數據庫
    await connectToDatabase();
    
    console.log('收到登入請求');
    const data = await request.json();
    const { email, password } = data;
    console.log('登入嘗試 - 電子郵件:', email);

    // 特殊處理預設用戶
    const isDefaultAdmin = email === 'admin@yellairlines.com' && password === 'admin123';
    const isDefaultUser = email === 'test@example.com' && password === 'password123';
    
    let user;
    
    if (isDefaultAdmin || isDefaultUser) {
      // 檢查數據庫中是否已存在預設用戶
      const existingUser = await UserModel.findByEmail(email);
      
      if (existingUser) {
        // 驗證密碼
        const isPasswordValid = await existingUser.comparePassword(password);
        if (isPasswordValid) {
          user = existingUser;
        } else {
          console.log('預設用戶密碼不正確');
          return NextResponse.json({ 
            success: false,
            error: '密碼不正確' 
          }, { status: 401 });
        }
      } else {
        // 創建預設用戶
        if (isDefaultAdmin) {
          console.log('創建預設管理員帳戶');
          // 創建默認管理員
          user = new UserModel({
            email: 'admin@yellairlines.com',
            password: 'admin123',
            firstName: '系統',
            lastName: '管理員',
            role: 'admin',
            memberLevel: 3,
            isMember: true
          });
        } else {
          console.log('創建預設用戶帳戶');
          // 創建默認用戶
          user = new UserModel({
            email: 'test@example.com',
            password: 'password123',
            firstName: '測試',
            lastName: '用戶',
            role: 'user',
            memberLevel: 1,
            isMember: true
          });
        }
        
        // 保存默認用戶到數據庫
        await user.save();
        console.log(`已創建預設${isDefaultAdmin ? '管理員' : '用戶'}帳戶`);
      }
    } else {
      // 查找用戶
      user = await UserModel.findByEmail(email);
      
      // 檢查用戶是否存在
      if (!user) {
        console.log('用戶不存在:', email);
        return NextResponse.json({ 
          success: false,
          error: '該電子郵件未註冊' 
        }, { status: 401 });
      }
      
      // 驗證密碼
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        console.log('密碼不正確');
        return NextResponse.json({ 
          success: false,
          error: '密碼不正確' 
        }, { status: 401 });
      }
    }

    console.log('登入成功，用戶ID:', user._id);
    
    // 創建會話
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7天後過期
    const session = await SessionModel.createSession(user._id.toString(), expiresAt);
    console.log('創建會話ID:', session.token);

    // 移除敏感資訊
    const userData = user.toObject();
    delete userData.password;

    // 創建響應
    const response = NextResponse.json({
      success: true,
      authenticated: true,
      user: userData
    });

    // 設置cookie
    response.cookies.set({
      name: 'sessionToken',
      value: session.token,
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