import { NextRequest, NextResponse } from 'next/server';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  addUser,
  isAdmin,
  getFlights,
  getFlightById,
  addFlight,
  updateFlight,
  deleteFlight,
  getMiles,
  getUserMiles,
  addMileRecord,
  updateMileRecord,
  deleteMileRecord,
  updateUserMemberLevel
} from '@/app/lib/db';

// 驗證管理員身份中間件函數
async function validateAdmin(request: NextRequest) {
  // 從請求中獲取會話信息
  const sessionId = request.cookies.get('yellairlines_session')?.value;
  
  if (!sessionId) {
    return { 
      isAuthorized: false, 
      response: NextResponse.json({ error: '未授權訪問' }, { status: 401 }) 
    };
  }
  
  try {
    // 獲取用戶信息
    const response = await fetch(`${request.nextUrl.origin}/api/auth`, {
      headers: {
        'Cookie': `yellairlines_session=${sessionId}`
      }
    });
    
    const data = await response.json();
    
    if (!data.authenticated || !data.user) {
      return { 
        isAuthorized: false, 
        response: NextResponse.json({ error: '未授權訪問' }, { status: 401 }) 
      };
    }
    
    // 檢查是否為管理員
    if (!isAdmin(data.user.id)) {
      return { 
        isAuthorized: false, 
        response: NextResponse.json({ error: '需要管理員權限' }, { status: 403 }) 
      };
    }
    
    return { isAuthorized: true, userId: data.user.id };
  } catch (error) {
    console.error('管理員驗證失敗:', error);
    return { 
      isAuthorized: false, 
      response: NextResponse.json({ error: '驗證過程中發生錯誤' }, { status: 500 }) 
    };
  }
}

// 獲取管理員資訊和狀態
export async function GET(request: NextRequest) {
  const validation = await validateAdmin(request);
  
  if (!validation.isAuthorized) {
    return validation.response;
  }
  
  // 獲取管理統計數據
  const users = getUsers();
  const flights = getFlights();
  const miles = getMiles();
  
  return NextResponse.json({
    success: true,
    stats: {
      totalUsers: users.length,
      totalFlights: flights.length,
      totalMileageRecords: miles.length
    }
  });
}

// 用戶管理 API
export async function POST(request: NextRequest) {
  const validation = await validateAdmin(request);
  
  if (!validation.isAuthorized) {
    return validation.response;
  }
  
  try {
    const data = await request.json();
    const { action, entityType, entityData, entityId } = data;
    
    // 處理不同的實體類型
    switch (entityType) {
      case 'user': 
        return handleUserAction(action, entityData, entityId);
      case 'flight':
        return handleFlightAction(action, entityData, entityId);
      case 'mileage':
        return handleMileageAction(action, entityData, entityId);
      default:
        return NextResponse.json({ error: '未知的實體類型' }, { status: 400 });
    }
  } catch (error) {
    console.error('管理員操作失敗:', error);
    return NextResponse.json({ error: '處理請求時發生錯誤' }, { status: 500 });
  }
}

// 處理用戶相關操作
function handleUserAction(action: string, userData: any, userId?: string) {
  switch (action) {
    case 'list':
      const users = getUsers().map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      return NextResponse.json({ users });
      
    case 'get':
      if (!userId) {
        return NextResponse.json({ error: '需要用戶ID' }, { status: 400 });
      }
      
      const user = getUserById(userId);
      if (!user) {
        return NextResponse.json({ error: '用戶不存在' }, { status: 404 });
      }
      
      const { password, ...userWithoutPassword } = user;
      return NextResponse.json({ user: userWithoutPassword });
      
    case 'create':
      const newUser = addUser(userData);
      if (!newUser) {
        return NextResponse.json({ error: '創建用戶失敗' }, { status: 400 });
      }
      
      const { password: newUserPwd, ...newUserWithoutPassword } = newUser;
      return NextResponse.json({ user: newUserWithoutPassword, message: '用戶創建成功' });
      
    case 'update':
      if (!userId) {
        return NextResponse.json({ error: '需要用戶ID' }, { status: 400 });
      }
      
      const updatedUser = updateUser(userId, userData);
      if (!updatedUser) {
        return NextResponse.json({ error: '更新用戶失敗' }, { status: 400 });
      }
      
      const { password: updatedUserPwd, ...updatedUserWithoutPassword } = updatedUser;
      return NextResponse.json({ user: updatedUserWithoutPassword, message: '用戶更新成功' });
      
    case 'delete':
      if (!userId) {
        return NextResponse.json({ error: '需要用戶ID' }, { status: 400 });
      }
      
      const deleteSuccess = deleteUser(userId);
      if (!deleteSuccess) {
        return NextResponse.json({ error: '刪除用戶失敗' }, { status: 400 });
      }
      
      return NextResponse.json({ message: '用戶刪除成功' });
      
    default:
      return NextResponse.json({ error: '未知的用戶操作' }, { status: 400 });
  }
}

// 處理航班相關操作
function handleFlightAction(action: string, flightData: any, flightId?: string) {
  switch (action) {
    case 'list':
      const flights = getFlights();
      return NextResponse.json({ flights });
      
    case 'get':
      if (!flightId) {
        return NextResponse.json({ error: '需要航班ID' }, { status: 400 });
      }
      
      const flight = getFlightById(flightId);
      if (!flight) {
        return NextResponse.json({ error: '航班不存在' }, { status: 404 });
      }
      
      return NextResponse.json({ flight });
      
    case 'create':
      const newFlight = addFlight(flightData);
      if (!newFlight) {
        return NextResponse.json({ error: '創建航班失敗' }, { status: 400 });
      }
      
      return NextResponse.json({ flight: newFlight, message: '航班創建成功' });
      
    case 'update':
      if (!flightId) {
        return NextResponse.json({ error: '需要航班ID' }, { status: 400 });
      }
      
      const updatedFlight = updateFlight(flightId, flightData);
      if (!updatedFlight) {
        return NextResponse.json({ error: '更新航班失敗' }, { status: 400 });
      }
      
      return NextResponse.json({ flight: updatedFlight, message: '航班更新成功' });
      
    case 'delete':
      if (!flightId) {
        return NextResponse.json({ error: '需要航班ID' }, { status: 400 });
      }
      
      const deleteSuccess = deleteFlight(flightId);
      if (!deleteSuccess) {
        return NextResponse.json({ error: '刪除航班失敗' }, { status: 400 });
      }
      
      return NextResponse.json({ message: '航班刪除成功' });
      
    default:
      return NextResponse.json({ error: '未知的航班操作' }, { status: 400 });
  }
}

// 處理里程相關操作
function handleMileageAction(action: string, mileageData: any, recordId?: string) {
  switch (action) {
    case 'list':
      const miles = getMiles();
      return NextResponse.json({ miles });
      
    case 'getUserMiles':
      if (!mileageData.userId) {
        return NextResponse.json({ error: '需要用戶ID' }, { status: 400 });
      }
      
      const userMiles = getUserMiles(mileageData.userId);
      return NextResponse.json({ miles: userMiles });
      
    case 'create':
      const newMileRecord = addMileRecord(mileageData);
      if (!newMileRecord) {
        return NextResponse.json({ error: '創建里程記錄失敗' }, { status: 400 });
      }
      
      return NextResponse.json({ mileRecord: newMileRecord, message: '里程記錄創建成功' });
      
    case 'update':
      if (!recordId) {
        return NextResponse.json({ error: '需要記錄ID' }, { status: 400 });
      }
      
      const updatedMileRecord = updateMileRecord(recordId, mileageData);
      if (!updatedMileRecord) {
        return NextResponse.json({ error: '更新里程記錄失敗' }, { status: 400 });
      }
      
      return NextResponse.json({ mileRecord: updatedMileRecord, message: '里程記錄更新成功' });
      
    case 'delete':
      if (!recordId) {
        return NextResponse.json({ error: '需要記錄ID' }, { status: 400 });
      }
      
      const deleteSuccess = deleteMileRecord(recordId);
      if (!deleteSuccess) {
        return NextResponse.json({ error: '刪除里程記錄失敗' }, { status: 400 });
      }
      
      return NextResponse.json({ message: '里程記錄刪除成功' });
      
    default:
      return NextResponse.json({ error: '未知的里程操作' }, { status: 400 });
  }
} 