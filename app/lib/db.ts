import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 數據文件路徑
const DB_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DB_DIR, 'users.json');
const SESSIONS_FILE = path.join(DB_DIR, 'sessions.json');
const FLIGHTS_FILE = path.join(DB_DIR, 'flights.json');
const MILES_FILE = path.join(DB_DIR, 'miles.json');

// 確保數據目錄存在
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// 用戶數據類型
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'admin'; // 角色字段
  memberLevel?: 'standard' | 'silver' | 'gold' | 'diamond'; // 會員等級
  totalMiles?: number; // 總里程數
  createdAt?: string;
  isMember?: boolean; // 是否已註冊成為會員
  dateOfBirth?: string; // 出生日期
  phone?: string; // 電話
  address?: string; // 地址
  country?: string; // 國家
  city?: string; // 城市
  postalCode?: string; // 郵遞區號
}

// 會話數據類型
export interface Session {
  userId: string;
  expires: string; // ISO 字符串格式的日期
}

// 航班數據類型
export interface Flight {
  id: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    time: string;
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
  };
  aircraft: string;
  price: number;
  seats: {
    economy: number;
    business: number;
    first: number;
  };
  status: 'scheduled' | 'delayed' | 'cancelled' | 'boarding' | 'departed' | 'arrived';
}

// 里程數據類型
export interface MileageRecord {
  id: string;
  userId: string;
  amount: number;
  type: 'earned' | 'used';
  description: string;
  details: string;
  date: string;
  status: 'pending' | 'completed';
  flightId?: string;
}

// 讀取用戶數據
export function getUsers(): User[] {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      // 初始化用戶文件，包含一個測試用戶和一個管理員用戶
      const initialUsers: User[] = [
        {
          id: '1',
          email: 'test@example.com',
          password: 'password123',
          firstName: '測試',
          lastName: '用戶',
          role: 'user',
          isMember: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'admin1',
          email: 'admin@yellairlines.com',
          password: 'admin123',
          firstName: '系統',
          lastName: '管理員',
          role: 'admin',
          isMember: true,
          createdAt: new Date().toISOString()
        }
      ];
      fs.writeFileSync(USERS_FILE, JSON.stringify(initialUsers, null, 2), 'utf8');
      return initialUsers;
    }

    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('讀取用戶數據失敗:', error);
    // 即使讀取失敗也返回預設使用者，確保始終可用的帳戶
    return [
      {
        id: '1',
        email: 'test@example.com',
        password: 'password123',
        firstName: '測試',
        lastName: '用戶',
        role: 'user',
        isMember: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'admin1',
        email: 'admin@yellairlines.com',
        password: 'admin123',
        firstName: '系統',
        lastName: '管理員',
        role: 'admin',
        isMember: true,
        createdAt: new Date().toISOString()
      }
    ];
  }
}

// 保存用戶數據
export function saveUsers(users: User[]): boolean {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('保存用戶數據失敗:', error);
    return false;
  }
}

// 添加新用戶
export function addUser(userData: Omit<User, 'id'>): User | null {
  try {
    const users = getUsers();
    
    // 檢查郵箱是否已存在
    if (users.some(user => user.email === userData.email)) {
      return null;
    }
    
    // 創建新用戶
    const newUser: User = {
      id: uuidv4(),
      ...userData,
      role: userData.role || 'user',
      createdAt: new Date().toISOString()
    };
    
    // 添加到用戶列表並保存
    users.push(newUser);
    saveUsers(users);
    
    return newUser;
  } catch (error) {
    console.error('添加用戶失敗:', error);
    return null;
  }
}

// 通過 ID 獲取用戶
export function getUserById(userId: string): User | null {
  try {
    const users = getUsers();
    return users.find(user => user.id === userId) || null;
  } catch (error) {
    console.error('獲取用戶失敗:', error);
    return null;
  }
}

// 通過郵箱獲取用戶
export function getUserByEmail(email: string): User | null {
  try {
    const users = getUsers();
    return users.find(user => user.email === email) || null;
  } catch (error) {
    console.error('獲取用戶失敗:', error);
    return null;
  }
}

// 驗證用戶憑證
export function verifyUser(email: string, password: string): User | null {
  try {
    const user = getUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  } catch (error) {
    console.error('驗證用戶失敗:', error);
    return null;
  }
}

// 檢查用戶是否為管理員
export function isAdmin(userId: string): boolean {
  try {
    const user = getUserById(userId);
    return user?.role === 'admin';
  } catch (error) {
    console.error('檢查管理員權限失敗:', error);
    return false;
  }
}

// 更新用戶信息
export function updateUser(userId: string, userData: Partial<Omit<User, 'id'>>): User | null {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return null;
    }
    
    // 更新用戶數據
    users[userIndex] = {
      ...users[userIndex],
      ...userData,
    };
    
    saveUsers(users);
    return users[userIndex];
  } catch (error) {
    console.error('更新用戶失敗:', error);
    return null;
  }
}

// 刪除用戶
export function deleteUser(userId: string): boolean {
  try {
    const users = getUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    
    if (filteredUsers.length === users.length) {
      return false; // 沒有找到要刪除的用戶
    }
    
    saveUsers(filteredUsers);
    return true;
  } catch (error) {
    console.error('刪除用戶失敗:', error);
    return false;
  }
}

// 讀取會話數據
export function getSessions(): Record<string, Session> {
  try {
    if (!fs.existsSync(SESSIONS_FILE)) {
      // 初始化會話文件
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify({}, null, 2), 'utf8');
      return {};
    }

    const data = fs.readFileSync(SESSIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('讀取會話數據失敗:', error);
    return {};
  }
}

// 保存會話數據
export function saveSessions(sessions: Record<string, Session>): boolean {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('保存會話數據失敗:', error);
    return false;
  }
}

// 創建新會話（文件系統）
export function createFileSession(userId: string, expiresAt?: string): string {
  try {
    const sessions = getSessions();
    
    // 生成會話ID
    const sessionId = uuidv4();
    
    // 設置過期時間（默認2小時）
    const expiresTime = expiresAt ? new Date(expiresAt) : new Date();
    if (!expiresAt) {
      expiresTime.setTime(expiresTime.getTime() + (2 * 60 * 60 * 1000));
    }
    
    // 存儲會話
    sessions[sessionId] = {
      userId,
      expires: expiresTime.toISOString()
    };
    
    saveSessions(sessions);
    return sessionId;
  } catch (error) {
    console.error('創建會話失敗:', error);
    return '';
  }
}

// 獲取會話信息（文件系統）
export function getFileSession(sessionId: string): { userId: string, expires: Date } | null {
  try {
    const sessions = getSessions();
    const session = sessions[sessionId];
    
    if (!session) {
      return null;
    }
    
    // 檢查會話是否過期
    const expires = new Date(session.expires);
    if (expires < new Date()) {
      // 會話已過期，刪除
      delete sessions[sessionId];
      saveSessions(sessions);
      return null;
    }
    
    return {
      userId: session.userId,
      expires
    };
  } catch (error) {
    console.error('獲取會話信息失敗:', error);
    return null;
  }
}

// 刪除會話（文件系統）
export function deleteFileSession(sessionId: string): boolean {
  try {
    const sessions = getSessions();
    
    if (!sessions[sessionId]) {
      return false;
    }
    
    delete sessions[sessionId];
    saveSessions(sessions);
    
    return true;
  } catch (error) {
    console.error('刪除會話失敗:', error);
    return false;
  }
}

// 清理過期會話
export function cleanupExpiredSessions(): void {
  try {
    const sessions = getSessions();
    const now = new Date();
    let changed = false;
    
    // 尋找並刪除過期會話
    Object.keys(sessions).forEach(sessionId => {
      const session = sessions[sessionId];
      const expires = new Date(session.expires);
      
      if (expires < now) {
        delete sessions[sessionId];
        changed = true;
      }
    });
    
    // 如果有會話被刪除，則保存更新後的會話數據
    if (changed) {
      saveSessions(sessions);
    }
  } catch (error) {
    console.error('清理過期會話失敗:', error);
  }
}

// 航班相關功能

// 讀取航班數據
export function getFlights(): Flight[] {
  try {
    if (!fs.existsSync(FLIGHTS_FILE)) {
      // 初始化航班數據
      const initialFlights: Flight[] = [];
      fs.writeFileSync(FLIGHTS_FILE, JSON.stringify(initialFlights, null, 2), 'utf8');
      return initialFlights;
    }

    const data = fs.readFileSync(FLIGHTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('讀取航班數據失敗:', error);
    return [];
  }
}

// 保存航班數據
export function saveFlights(flights: Flight[]): boolean {
  try {
    fs.writeFileSync(FLIGHTS_FILE, JSON.stringify(flights, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('保存航班數據失敗:', error);
    return false;
  }
}

// 添加新航班
export function addFlight(flightData: Omit<Flight, 'id'>): Flight | null {
  try {
    const flights = getFlights();
    
    // 創建新航班
    const newFlight: Flight = {
      id: uuidv4(),
      ...flightData
    };
    
    flights.push(newFlight);
    saveFlights(flights);
    
    return newFlight;
  } catch (error) {
    console.error('添加航班失敗:', error);
    return null;
  }
}

// 獲取單個航班
export function getFlightById(flightId: string): Flight | null {
  try {
    const flights = getFlights();
    return flights.find(flight => flight.id === flightId) || null;
  } catch (error) {
    console.error('獲取航班失敗:', error);
    return null;
  }
}

// 更新航班
export function updateFlight(flightId: string, flightData: Partial<Omit<Flight, 'id'>>): Flight | null {
  try {
    const flights = getFlights();
    const flightIndex = flights.findIndex(flight => flight.id === flightId);
    
    if (flightIndex === -1) {
      return null;
    }
    
    flights[flightIndex] = {
      ...flights[flightIndex],
      ...flightData
    };
    
    saveFlights(flights);
    return flights[flightIndex];
  } catch (error) {
    console.error('更新航班失敗:', error);
    return null;
  }
}

// 刪除航班
export function deleteFlight(flightId: string): boolean {
  try {
    const flights = getFlights();
    const filteredFlights = flights.filter(flight => flight.id !== flightId);
    
    if (filteredFlights.length === flights.length) {
      return false;
    }
    
    saveFlights(filteredFlights);
    return true;
  } catch (error) {
    console.error('刪除航班失敗:', error);
    return false;
  }
}

// 里程相關功能

// 讀取里程數據
export function getMiles(): MileageRecord[] {
  try {
    if (!fs.existsSync(MILES_FILE)) {
      // 初始化里程數據
      const initialMiles: MileageRecord[] = [];
      fs.writeFileSync(MILES_FILE, JSON.stringify(initialMiles, null, 2), 'utf8');
      return initialMiles;
    }

    const data = fs.readFileSync(MILES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('讀取里程數據失敗:', error);
    return [];
  }
}

// 保存里程數據
export function saveMiles(miles: MileageRecord[]): boolean {
  try {
    fs.writeFileSync(MILES_FILE, JSON.stringify(miles, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('保存里程數據失敗:', error);
    return false;
  }
}

// 獲取用戶里程記錄
export function getUserMiles(userId: string): MileageRecord[] {
  try {
    const miles = getMiles();
    return miles.filter(mile => mile.userId === userId);
  } catch (error) {
    console.error('獲取用戶里程記錄失敗:', error);
    return [];
  }
}

// 添加里程記錄
export function addMileRecord(mileData: Omit<MileageRecord, 'id'>): MileageRecord | null {
  try {
    const miles = getMiles();
    
    const newMileRecord: MileageRecord = {
      id: uuidv4(),
      ...mileData
    };
    
    miles.push(newMileRecord);
    saveMiles(miles);
    
    return newMileRecord;
  } catch (error) {
    console.error('添加里程記錄失敗:', error);
    return null;
  }
}

// 更新里程記錄
export function updateMileRecord(recordId: string, data: Partial<Omit<MileageRecord, 'id'>>): MileageRecord | null {
  try {
    const miles = getMiles();
    const recordIndex = miles.findIndex(mile => mile.id === recordId);
    
    if (recordIndex === -1) {
      return null;
    }
    
    miles[recordIndex] = {
      ...miles[recordIndex],
      ...data
    };
    
    saveMiles(miles);
    return miles[recordIndex];
  } catch (error) {
    console.error('更新里程記錄失敗:', error);
    return null;
  }
}

// 刪除里程記錄
export function deleteMileRecord(recordId: string): boolean {
  try {
    const miles = getMiles();
    const filteredMiles = miles.filter(mile => mile.id !== recordId);
    
    if (filteredMiles.length === miles.length) {
      return false;
    }
    
    saveMiles(filteredMiles);
    return true;
  } catch (error) {
    console.error('刪除里程記錄失敗:', error);
    return false;
  }
}

// 更新用戶的會員等級
export function updateUserMemberLevel(userId: string, memberLevel: 'standard' | 'silver' | 'gold' | 'diamond'): User | null {
  try {
    return updateUser(userId, { memberLevel });
  } catch (error) {
    console.error('更新會員等級失敗:', error);
    return null;
  }
}

// 根據總里程自動計算會員等級
export function calculateMemberLevel(totalMiles: number): 'standard' | 'silver' | 'gold' | 'diamond' {
  if (totalMiles >= 100000) {
    return 'diamond';
  } else if (totalMiles >= 50000) {
    return 'gold';
  } else if (totalMiles >= 25000) {
    return 'silver';
  } else {
    return 'standard';
  }
}

// 獲取會員等級對應的中文名稱
export function getMemberLevelName(level: string): string {
  switch (level) {
    case 'diamond':
      return '鑽石卡會員';
    case 'gold':
      return '金卡會員';
    case 'silver':
      return '銀卡會員';
    default:
      return '普通會員';
  }
}

// 模擬用戶數據庫
let users = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    memberLevel: 3,
    isMember: true
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    firstName: 'Normal',
    lastName: 'User',
    role: 'user',
    memberLevel: 1,
    isMember: true
  }
];

// 模擬會話存儲
const sessions: Record<string, { userId: string, expiresAt: string }> = {};

// 生成隨機字符串作為會話ID
function generateSessionId(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 創建新用戶
export function createUser(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  // 檢查電子郵件是否已存在
  if (getUserByEmail(userData.email)) {
    return null;
  }

  // 創建新用戶
  const newUser = {
    id: `${users.length + 1}`,
    ...userData,
    role: 'user',
    memberLevel: 1,
    isMember: true
  };

  users.push(newUser);
  return newUser;
}

// 更新用戶資料
export function updateUserData(userId: string, updates: Partial<Omit<typeof users[0], 'id'>>) {
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex === -1) return null;

  // 不允許更新 id
  const { id, ...allowedUpdates } = updates as any;
  
  // 更新用戶
  users[userIndex] = {
    ...users[userIndex],
    ...allowedUpdates
  };

  return users[userIndex];
}

// 創建會話 (內存)
export function createMemorySession(userId: string, expiresAt: string): string {
  const sessionId = generateSessionId();
  sessions[sessionId] = { userId, expiresAt };
  return sessionId;
}

// 獲取會話 (內存)
export function getMemorySession(sessionId: string) {
  return sessions[sessionId];
}

// 刪除會話 (內存)
export function deleteMemorySession(sessionId: string): boolean {
  if (sessions[sessionId]) {
    delete sessions[sessionId];
    return true;
  }
  return false;
} 