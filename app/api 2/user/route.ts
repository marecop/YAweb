import { NextRequest, NextResponse } from 'next/server';
import { getSession, getUserById, updateUser } from '@/app/lib/db';

// 獲取當前用戶信息
export async function GET(request: NextRequest) {
  // 從Cookie獲取sessionId
  const sessionId = request.cookies.get('sessionId')?.value;
  
  if (!sessionId) {
    return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
  }
  
  // 獲取會話信息
  const session = getSession(sessionId);
  
  if (!session) {
    return NextResponse.json({ error: '會話已過期' }, { status: 401 });
  }
  
  // 獲取用戶ID
  const userId = session.userId;
  
  // 獲取用戶資料
  const user = getUserById(userId);
  
  if (!user) {
    return NextResponse.json({ error: '找不到用戶' }, { status: 404 });
  }
  
  // 移除敏感信息
  const { password, ...safeUserData } = user;
  
  return NextResponse.json({ user: safeUserData });
}

// 更新用戶資料
export async function PUT(request: NextRequest) {
  // 從Cookie獲取sessionId
  const sessionId = request.cookies.get('sessionId')?.value;
  
  if (!sessionId) {
    return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
  }
  
  // 獲取會話信息
  const session = getSession(sessionId);
  
  if (!session) {
    return NextResponse.json({ error: '會話已過期' }, { status: 401 });
  }
  
  // 獲取用戶ID
  const userId = session.userId;
  
  try {
    // 獲取請求體
    const data = await request.json();
    
    // 允許更新的字段
    const allowedFields = [
      'firstName', 
      'lastName', 
      'isMember', 
      'dateOfBirth', 
      'phone', 
      'address', 
      'country', 
      'city', 
      'postalCode'
    ];
    
    // 過濾請求數據
    const updateData: any = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }
    
    // 確保會員註冊標記
    if (updateData.isMember === true) {
      // 檢查必填字段
      const requiredFields = ['dateOfBirth', 'phone', 'address', 'country', 'city', 'postalCode'];
      const missingFields = requiredFields.filter(field => !updateData[field]);
      
      if (missingFields.length > 0) {
        return NextResponse.json({ 
          error: `以下字段為必填項: ${missingFields.join(', ')}` 
        }, { status: 400 });
      }
    }
    
    // 更新用戶資料
    const updatedUser = updateUser(userId, updateData);
    
    if (!updatedUser) {
      return NextResponse.json({ error: '更新用戶資料失敗' }, { status: 500 });
    }
    
    // 移除敏感信息
    const { password, ...safeUserData } = updatedUser;
    
    return NextResponse.json({ 
      message: '用戶資料已更新',
      user: safeUserData
    });
  } catch (error) {
    console.error('更新用戶資料時出錯:', error);
    return NextResponse.json({ error: '更新用戶資料時發生錯誤' }, { status: 500 });
  }
} 