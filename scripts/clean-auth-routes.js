const fs = require('fs');
const path = require('path');

console.log('開始清理驗證路由...');

// 路徑
const loginRoutePath = path.join(process.cwd(), 'app', 'api', 'auth', 'login', 'route.ts');
const registerRoutePath = path.join(process.cwd(), 'app', 'api', 'auth', 'register', 'route.ts');

// 清理登入路由
if (fs.existsSync(loginRoutePath)) {
  console.log('檢查登入路由...');
  let content = fs.readFileSync(loginRoutePath, 'utf8');
  
  // 替換登入邏輯，確保正確處理使用者驗證
  const updatedLoginContent = `import { NextResponse } from 'next/server';
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
}`;

  fs.writeFileSync(loginRoutePath, updatedLoginContent);
  console.log('登入路由已清理完成');
} else {
  console.log('找不到登入路由檔案', loginRoutePath);
}

// 清理註冊路由
if (fs.existsSync(registerRoutePath)) {
  console.log('檢查註冊路由...');
  
  const updatedRegisterContent = `import { NextResponse } from 'next/server';
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
    const newUserId = \`user_\${Date.now()}\`;
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
}`;

  fs.writeFileSync(registerRoutePath, updatedRegisterContent);
  console.log('註冊路由已清理完成');
} else {
  console.log('找不到註冊路由檔案', registerRoutePath);
  
  // 如果檔案不存在，創建目錄和檔案
  const registerDir = path.dirname(registerRoutePath);
  if (!fs.existsSync(registerDir)) {
    fs.mkdirSync(registerDir, { recursive: true });
    console.log('已創建註冊路由目錄');
  }
  
  const newRegisterContent = `import { NextResponse } from 'next/server';
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
    const newUserId = \`user_\${Date.now()}\`;
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
}`;

  fs.writeFileSync(registerRoutePath, newRegisterContent);
  console.log('已創建新的註冊路由檔案');
}

// 確保users數據存在
const usersDataPath = path.join(process.cwd(), 'data', 'users.ts');
if (!fs.existsSync(path.dirname(usersDataPath))) {
  fs.mkdirSync(path.dirname(usersDataPath), { recursive: true });
}

if (!fs.existsSync(usersDataPath)) {
  const usersData = `export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  miles: number;
  level: 'Blue' | 'Silver' | 'Gold' | 'Platinum';
}

export const users: User[] = [
  {
    id: 'user_1',
    firstName: '張',
    lastName: '小明',
    email: 'test@example.com',
    password: 'password123',
    miles: 8500,
    level: 'Silver',
  },
  {
    id: 'user_2',
    firstName: '李',
    lastName: '小花',
    email: 'user@test.com',
    password: 'test123',
    miles: 25000,
    level: 'Gold',
  },
  {
    id: 'user_3',
    firstName: '王',
    lastName: '大同',
    email: 'admin@yellow.com',
    password: 'admin',
    miles: 60000,
    level: 'Platinum',
  },
];`;

  fs.writeFileSync(usersDataPath, usersData);
  console.log('已創建使用者資料檔案');
}

console.log('驗證路由清理完成'); 