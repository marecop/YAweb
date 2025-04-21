import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase, { isUsingMockConnection } from '@/app/lib/mongodb';
import UserModel from '@/app/models/User';
import SessionModel from '@/app/models/Session';

// 從cookie字符串中獲取特定cookie值的函數
function getCookie(cookieString: string | null, name: string): string | null {
  if (!cookieString) return null;
  const match = cookieString.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

// 檢查用戶身份驗證狀態
export async function GET(request: NextRequest) {
  try {
    // 連接到數據庫
    await connectToDatabase();
    
    // 檢查是否使用模擬連接
    if (isUsingMockConnection()) {
      console.log('使用模擬模式檢查身份驗證狀態');
      
      // 從 cookie 中獲取會話令牌
      const sessionToken = request.cookies.get('sessionToken')?.value;
      
      if (!sessionToken) {
        return NextResponse.json({ authenticated: false });
      }
      
      // 在模擬模式下，我們假設任何存在的會話令牌都是有效的
      // 創建模擬用戶數據 (這裡我們使用一個通用的測試用戶)
      const mockUser: Record<string, any> = {
        _id: Math.random().toString(36).substring(2, 15),
        email: 'test123@example.com',
        firstName: '測試',
        lastName: '用戶',
        role: 'user',
        isMember: true,
        memberLevel: 1,
        totalMiles: 0,
        createdAt: new Date().toISOString()
      };
      
      return NextResponse.json({
        authenticated: true,
        user: mockUser
      });
    }
    
    // 從 cookie 中獲取會話令牌
    const sessionToken = request.cookies.get('sessionToken')?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ authenticated: false });
    }
    
    // 從數據庫獲取會話信息
    const session = await SessionModel.findByToken(sessionToken);
    
    if (!session) {
      return NextResponse.json({ authenticated: false });
    }
    
    // 檢查會話是否過期
    const expiryDate = new Date(session.expires);
    if (expiryDate < new Date()) {
      return NextResponse.json({ authenticated: false, error: '會話已過期' });
    }
    
    // 獲取用戶信息
    const user = await UserModel.findById(session.userId);
    
    if (!user) {
      return NextResponse.json({ authenticated: false });
    }
    
    // 移除敏感資訊
    const userData = user.toObject();
    const { password: _, ...userWithoutPassword } = userData;
    
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

// 用戶註冊
export async function POST(request: NextRequest) {
  try {
    // 連接到數據庫
    await connectToDatabase();
    
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
    
    // 檢查是否使用模擬連接
    if (isUsingMockConnection()) {
      console.log('使用模擬模式處理註冊請求');
      
      // 創建模擬用戶數據
      const mockUser: Record<string, any> = {
        _id: Math.random().toString(36).substring(2, 15),
        email,
        firstName,
        lastName,
        role: 'user',
        isMember: true,
        memberLevel: 1,
        totalMiles: 0,
        createdAt: new Date().toISOString()
      };
      
      // 創建模擬會話令牌
      const mockSessionToken = Math.random().toString(36).substring(2, 15);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7天後過期
      
      // 創建響應
      const response = NextResponse.json({
        success: true,
        user: mockUser,
        message: '註冊成功 (模擬模式)'
      });
      
      // 設置 cookie
      response.cookies.set({
        name: 'sessionToken',
        value: mockSessionToken,
        httpOnly: true,
        path: '/',
        expires: expiresAt
      });
      
      return response;
    }
    
    // 實際數據庫操作 - 只有在非模擬模式下執行
    // 檢查電子郵件是否已存在
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '此電子郵件已被註冊' },
        { status: 409 }
      );
    }
    
    // 創建新用戶
    const newUser = new UserModel({
      email,
      password,
      firstName,
      lastName,
      role: 'user',
      isMember: true
    });
    
    // 保存用戶 (密碼將通過中間件自動加密)
    await newUser.save();
    
    // 創建會話
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7天後過期
    const userId = newUser._id ? newUser._id.toString() : '';
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
    // 連接到數據庫
    await connectToDatabase();
    
    const { email, password } = await request.json();
    
    console.log('嘗試登入:', email);
    
    // 驗證請求數據
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: '請提供電子郵件和密碼' },
        { status: 400 }
      );
    }
    
    // 檢查是否使用模擬連接
    if (isUsingMockConnection()) {
      console.log('使用模擬模式處理登入請求');
      
      // 特殊處理預設用戶
      const isDefaultAdmin = email === 'admin@yellairlines.com' && password === 'admin123';
      const isDefaultUser = email === 'test@example.com' && password === 'password123';
      // 檢查用戶是否是我們剛才註冊的測試用戶
      const isTestUser = email === 'test123@example.com' && password === 'password123';
      
      if (isDefaultAdmin || isDefaultUser || isTestUser) {
        // 創建模擬用戶數據
        const mockUser: Record<string, any> = {
          _id: Math.random().toString(36).substring(2, 15),
          email,
          firstName: isDefaultAdmin ? '系統' : isTestUser ? '測試' : '測試',
          lastName: isDefaultAdmin ? '管理員' : isTestUser ? '用戶' : '用戶',
          role: isDefaultAdmin ? 'admin' : 'user',
          isMember: true,
          memberLevel: isDefaultAdmin ? 3 : 1,
          totalMiles: 0,
          createdAt: new Date().toISOString()
        };
        
        // 創建模擬會話令牌
        const mockSessionToken = Math.random().toString(36).substring(2, 15);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7天後過期
        
        // 創建響應
        const response = NextResponse.json({
          success: true,
          user: mockUser,
          message: '登入成功 (模擬模式)'
        });
        
        // 設置 cookie
        response.cookies.set({
          name: 'sessionToken',
          value: mockSessionToken,
          httpOnly: true,
          path: '/',
          expires: expiresAt
        });
        
        return response;
      } else {
        return NextResponse.json(
          { success: false, error: '電子郵件或密碼不正確' },
          { status: 401 }
        );
      }
    }
    
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
          return NextResponse.json(
            { success: false, error: '密碼不正確' },
            { status: 401 }
          );
        }
      } else {
        // 創建預設用戶
        if (isDefaultAdmin) {
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
        return NextResponse.json(
          { success: false, error: '該電子郵件未註冊' },
          { status: 401 }
        );
      }
      
      // 驗證密碼
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, error: '密碼不正確' },
          { status: 401 }
        );
      }
    }
    
    // 創建會話
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7天後過期
    const userId = user._id ? user._id.toString() : '';
    const session = await SessionModel.createSession(userId, expiresAt);
    
    // 移除敏感資訊
    const userData = user.toObject();
    const { password: _, ...userWithoutPassword } = userData;
    
    // 創建響應
    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: '登入成功'
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
    // 連接到數據庫
    await connectToDatabase();
    
    // 從 cookie 中獲取會話令牌
    const sessionToken = request.cookies.get('sessionToken')?.value;
    
    if (sessionToken) {
      // 從數據庫中刪除會話
      await SessionModel.deleteOne({ token: sessionToken });
    }
    
    // 創建響應
    const response = NextResponse.json({
      success: true,
      message: '已成功登出'
    });
    
    // 清除 cookie
    response.cookies.delete('sessionToken');
    
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
    const sessionToken = getCookie(request.headers.get('cookie'), 'sessionToken');
    const session = sessionToken ? await SessionModel.findByToken(sessionToken) : null;

    if (!session || session.userId !== userId) {
      return NextResponse.json({ error: '未授權的請求' }, { status: 401 });
    }

    // 獲取目前用戶資料
    const user = await UserModel.findById(userId);
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
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) {
      return NextResponse.json({ error: '更新用戶資料失敗' }, { status: 500 });
    }

    // 返回不含敏感信息的用戶資料
    const safeUser = {
      id: updatedUser._id,
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