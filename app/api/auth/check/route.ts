import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { users } from '@/data/users';

export async function GET() {
  try {
    // 從cookie獲取使用者ID
    const authToken = cookies().get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: '未登入' },
        { status: 401 }
      );
    }

    // 查找使用者
    const user = users.find(u => u.id === authToken);
    
    if (!user) {
      return NextResponse.json(
        { error: '使用者不存在' },
        { status: 401 }
      );
    }

    // 返回使用者資訊 (排除密碼)
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('檢查使用者失敗', error);
    return NextResponse.json(
      { error: '檢查使用者過程發生錯誤' },
      { status: 500 }
    );
  }
}