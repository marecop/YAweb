import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // 刪除認證cookie
    cookies().delete('auth-token');
    
    return NextResponse.json({
      message: '已成功登出'
    });
  } catch (error) {
    console.error('登出錯誤', error);
    return NextResponse.json(
      { error: '登出過程發生錯誤' },
      { status: 500 }
    );
  }
}