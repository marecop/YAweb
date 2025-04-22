import { NextRequest, NextResponse } from 'next/server';
import { getUserMiles, getUserById, isAdmin, getFileSession, addMileRecord, updateUser, calculateMemberLevel, updateMileRecord } from '@/app/lib/db';

// 獲取特定用戶的里程資訊
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // 檢查授權
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }
    
    const session = getFileSession(sessionId);
    
    if (!session) {
      return NextResponse.json({ error: '會話已過期' }, { status: 401 });
    }
    
    // 檢查是否為管理員或該用戶本人
    const isUserAdmin = await isAdmin(session.userId);
    
    if (!isUserAdmin && session.userId !== params.userId) {
      return NextResponse.json({ error: '無權訪問此資源' }, { status: 403 });
    }
    
    // 獲取用戶里程資訊
    const userMiles = await getUserMiles(params.userId);
    
    if (!userMiles) {
      return NextResponse.json({ error: '找不到里程資訊' }, { status: 404 });
    }
    
    // 獲取用戶資訊
    const user = await getUserById(params.userId);
    
    if (!user) {
      return NextResponse.json({ error: '找不到用戶' }, { status: 404 });
    }
    
    // 計算里程資訊
    const totalMiles = user.totalMiles || 0;
    const availableMiles = userMiles.reduce((total, record) => {
      if (record.type === 'earned' && record.status === 'completed') {
        return total + record.amount;
      } else if (record.type === 'used' && record.status === 'completed') {
        return total - record.amount;
      }
      return total;
    }, 0);
    
    // 獲取會員等級
    const memberLevel = user.memberLevel || 'standard';
    
    // 模擬里程到期日期（一年後）
    const expireDate = new Date();
    expireDate.setFullYear(expireDate.getFullYear() + 1);
    
    return NextResponse.json({
      userId: params.userId,
      totalMiles,
      availableMiles,
      memberLevel,
      expireDate: expireDate.toISOString(),
      lastUpdated: new Date().toISOString(),
      history: userMiles
    });
  } catch (error) {
    console.error('獲取用戶里程資訊失敗:', error);
    return NextResponse.json({ error: '獲取用戶里程資訊失敗' }, { status: 500 });
  }
}

// 為特定用戶添加里程記錄
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // 檢查授權
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }
    
    const session = getFileSession(sessionId);
    
    if (!session) {
      return NextResponse.json({ error: '會話已過期' }, { status: 401 });
    }
    
    // 檢查是否為管理員
    const isUserAdmin = await isAdmin(session.userId);
    
    if (!isUserAdmin) {
      return NextResponse.json({ error: '需要管理員權限' }, { status: 403 });
    }
    
    // 解析請求數據
    const data = await request.json();
    
    // 驗證必要字段
    if (!data.amount || !data.type || !data.description) {
      return NextResponse.json({ error: '缺少必要字段' }, { status: 400 });
    }
    
    // 添加里程記錄
    const newRecord = {
      userId: params.userId,
      amount: data.amount,
      type: data.type,
      description: data.description,
      details: data.details || `管理員${data.type === 'earned' ? '添加' : '使用'}里程`,
      date: data.date || new Date().toISOString(),
      status: data.status || 'completed',
      flightId: data.flightId,
      flightNumber: data.flightNumber,
      bookingReference: data.bookingReference
    };
    
    const addedRecord = await addMileRecord(newRecord);
    
    if (!addedRecord) {
      return NextResponse.json({ error: '添加里程記錄失敗' }, { status: 500 });
    }
    
    // 更新用戶總里程和會員等級
    const user = await getUserById(params.userId);
    
    if (!user) {
      return NextResponse.json({ error: '找不到用戶' }, { status: 404 });
    }
    
    let totalMilesChange = 0;
    
    // 根據記錄類型和狀態更新總里程
    if (data.status === 'completed') {
      if (data.type === 'earned') {
        totalMilesChange = data.amount;
      } else if (data.type === 'used') {
        totalMilesChange = -data.amount;
      }
    }
    
    const newTotalMiles = (user.totalMiles || 0) + totalMilesChange;
    const newMemberLevel = calculateMemberLevel(newTotalMiles);
    
    // 更新用戶資料
    const updatedUser = await updateUser(params.userId, {
      totalMiles: newTotalMiles,
      memberLevel: newMemberLevel as any
    });
    
    return NextResponse.json({
      success: true,
      message: '里程記錄添加成功',
      record: addedRecord,
      user: {
        totalMiles: updatedUser?.totalMiles,
        memberLevel: updatedUser?.memberLevel
      }
    });
  } catch (error) {
    console.error('添加里程記錄失敗:', error);
    return NextResponse.json({ error: '添加里程記錄失敗' }, { status: 500 });
  }
}

// 更新特定用戶的里程資訊
export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // 檢查授權
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }
    
    const session = getFileSession(sessionId);
    
    if (!session) {
      return NextResponse.json({ error: '會話已過期' }, { status: 401 });
    }
    
    // 檢查是否為管理員
    const isUserAdmin = await isAdmin(session.userId);
    
    if (!isUserAdmin) {
      return NextResponse.json({ error: '需要管理員權限' }, { status: 403 });
    }
    
    // 解析請求數據
    const data = await request.json();
    
    // 驗證必要字段
    if (!data.recordId) {
      return NextResponse.json({ error: '缺少記錄ID' }, { status: 400 });
    }
    
    // 更新里程記錄
    const updateData: any = {};
    
    // 只更新提供的字段
    if (data.amount) updateData.amount = data.amount;
    if (data.type) updateData.type = data.type;
    if (data.description) updateData.description = data.description;
    if (data.details) updateData.details = data.details;
    if (data.date) updateData.date = data.date;
    if (data.status) updateData.status = data.status;
    if (data.flightId) updateData.flightId = data.flightId;
    
    // 添加審核信息
    updateData.updatedAt = new Date().toISOString();
    updateData.updatedBy = session.userId;
    
    // 更新記錄
    const updatedRecord = await updateMileRecord(data.recordId, updateData);
    
    if (!updatedRecord) {
      return NextResponse.json({ error: '更新里程記錄失敗' }, { status: 404 });
    }
    
    // 用戶總里程可能需要重新計算
    if (data.amount || data.type || data.status) {
      const userMiles = await getUserMiles(params.userId);
      const user = await getUserById(params.userId);
      
      if (user) {
        // 根據所有完成的記錄重新計算總里程
        const totalMiles = userMiles.reduce((total, record) => {
          if (record.status === 'completed') {
            if (record.type === 'earned') {
              return total + record.amount;
            } else if (record.type === 'used') {
              return total - record.amount;
            }
          }
          return total;
        }, 0);
        
        // 更新用戶總里程和會員等級
        const newMemberLevel = calculateMemberLevel(totalMiles);
        await updateUser(params.userId, {
          totalMiles,
          memberLevel: newMemberLevel as any
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: '里程記錄更新成功',
      record: updatedRecord
    });
  } catch (error) {
    console.error('更新用戶里程記錄失敗:', error);
    return NextResponse.json({ error: '更新用戶里程記錄失敗' }, { status: 500 });
  }
} 