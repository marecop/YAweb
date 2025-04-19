import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getSession, getUserById, updateUser } from '@/app/lib/db';
import { calculateMemberLevel } from '@/app/utils/memberUtils';

// 里程記錄介面
export interface MileageRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'earned' | 'used';
  flightNo?: string;
}

// 里程信息介面
export interface MileageInfo {
  totalMiles: number;
  availableMiles: number;
  level: string;
  nextLevel: string;
  milesForNextLevel: number;
  expireDate: string;
}

// 里程數據文件路徑
const MILEAGE_DIR = path.join(process.cwd(), 'data/mileage');

// 確保里程目錄存在
if (!fs.existsSync(MILEAGE_DIR)) {
  fs.mkdirSync(MILEAGE_DIR, { recursive: true });
}

// 獲取用戶里程數據路徑
function getUserMileageFilePath(userId: string): string {
  return path.join(MILEAGE_DIR, `${userId}.json`);
}

// 獲取用戶里程數據
function getUserMileageData(userId: string): { info: MileageInfo, history: MileageRecord[] } {
  const filePath = getUserMileageFilePath(userId);
  
  // 檢查文件是否存在
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return data;
  }
  
  // 返回默認數據
  return {
    info: {
      totalMiles: 0,
      availableMiles: 0,
      level: '普通會員',
      nextLevel: '銀卡會員',
      milesForNextLevel: 25000,
      expireDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    },
    history: []
  };
}

// 保存用戶里程數據
function saveUserMileageData(userId: string, data: { info: MileageInfo, history: MileageRecord[] }): void {
  const filePath = getUserMileageFilePath(userId);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 處理GET請求
export async function GET(request: NextRequest) {
  // 從Cookie獲取sessionId
  const sessionId = request.cookies.get('sessionId')?.value;
  
  if (!sessionId) {
    return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
  }
  
  // 獲取會話信息
  const session = await getSession(sessionId);
  
  if (!session) {
    return NextResponse.json({ error: '會話已過期' }, { status: 401 });
  }
  
  // 獲取用戶ID
  const userId = session.userId;
  
  // 獲取用戶里程數據
  const mileageData = getUserMileageData(userId);
  
  return NextResponse.json(mileageData);
}

// 處理POST請求 - 添加新的里程記錄
export async function POST(request: NextRequest) {
  // 從Cookie獲取sessionId
  const sessionId = request.cookies.get('sessionId')?.value;
  
  if (!sessionId) {
    return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
  }
  
  // 獲取會話信息
  const session = await getSession(sessionId);
  
  if (!session) {
    return NextResponse.json({ error: '會話已過期' }, { status: 401 });
  }
  
  // 獲取用戶ID
  const userId = session.userId;
  
  try {
    // 解析請求體
    const body = await request.json();
    const { description, amount, status, flightNo } = body;
    
    // 驗證數據
    if (!description || typeof amount !== 'number' || !['earned', 'used'].includes(status)) {
      return NextResponse.json({ error: '無效的數據' }, { status: 400 });
    }
    
    // 獲取現有數據
    const mileageData = getUserMileageData(userId);
    
    // 創建新記錄
    const newRecord: MileageRecord = {
      id: uuidv4(),
      date: new Date().toISOString(),
      description,
      amount,
      status
    };
    
    // 如果有航班號，則添加到記錄中
    if (flightNo) {
      newRecord.flightNo = flightNo;
    }
    
    // 更新里程信息
    if (status === 'earned') {
      mileageData.info.totalMiles += amount;
      mileageData.info.availableMiles += amount;
    } else {
      mileageData.info.availableMiles -= amount;
    }
    
    // 更新會員等級
    if (mileageData.info.totalMiles >= 100000) {
      mileageData.info.level = '鑽石卡會員';
      mileageData.info.nextLevel = '最高等級';
      mileageData.info.milesForNextLevel = 0;
    } else if (mileageData.info.totalMiles >= 50000) {
      mileageData.info.level = '金卡會員';
      mileageData.info.nextLevel = '鑽石卡會員';
      mileageData.info.milesForNextLevel = 100000 - mileageData.info.totalMiles;
    } else if (mileageData.info.totalMiles >= 25000) {
      mileageData.info.level = '銀卡會員';
      mileageData.info.nextLevel = '金卡會員';
      mileageData.info.milesForNextLevel = 50000 - mileageData.info.totalMiles;
    } else {
      mileageData.info.level = '普通會員';
      mileageData.info.nextLevel = '銀卡會員';
      mileageData.info.milesForNextLevel = 25000 - mileageData.info.totalMiles;
    }
    
    // 添加新記錄到歷史
    mileageData.history.unshift(newRecord);
    
    // 保存更新後的數據
    saveUserMileageData(userId, mileageData);
    
    // 更新用戶的總里程和會員等級
    const user = getUserById(userId);
    if (user) {
      const totalMiles = user.totalMiles || 0;
      const newTotalMiles = status === 'earned' ? totalMiles + amount : totalMiles;
      const memberLevel = calculateMemberLevel(newTotalMiles);
      
      // 更新用戶數據
      updateUser(userId, {
        totalMiles: newTotalMiles,
        memberLevel
      });
    }
    
    return NextResponse.json({ success: true, data: mileageData });
  } catch (error) {
    console.error('添加里程記錄失敗:', error);
    return NextResponse.json({ error: '處理請求時出錯' }, { status: 500 });
  }
} 