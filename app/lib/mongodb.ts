import mongoose from 'mongoose';

// 創建類型接口
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isMock: boolean;
}

// MongoDB 連接字符串，從環境變量獲取
// 在生產環境中，應該在 Render 平台上設置這個環境變量
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://youruser:yourpassword@cluster0.mongodb.net/yellairlines?retryWrites=true&w=majority';

// 創建具有正確類型的全局變量
let globalMongoose: MongooseConnection = (global as any).mongoose || { conn: null, promise: null, isMock: false };

// 將變量重新分配給全局作用域
if (!(global as any).mongoose) {
  (global as any).mongoose = globalMongoose;
}

// 創建模擬連接
async function createMockConnection() {
  console.log('使用模擬 MongoDB 連接...');
  globalMongoose.isMock = true;
  
  // 返回 mongoose 實例，但不實際連接到數據庫
  return mongoose;
}

/**
 * 連接到 MongoDB 的函數
 * 使用連接池減少連接開銷
 */
export async function connectToDatabase() {
  // 如果連接已存在，返回現有連接
  if (globalMongoose.conn) {
    return globalMongoose.conn;
  }

  // 如果沒有 promise，創建一個新的連接
  if (!globalMongoose.promise) {
    const opts = {
      bufferCommands: false,
    };

    // 檢查環境變量，決定是使用實際連接還是模擬連接
    const useMock = process.env.USE_MOCK_DB === 'true' || !MONGODB_URI.includes('mongodb');
    
    if (useMock) {
      console.log('使用模擬 MongoDB 連接模式');
      globalMongoose.promise = createMockConnection();
    } else {
      console.log('正在連接到 MongoDB...');
      globalMongoose.promise = mongoose.connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log('MongoDB 連接成功！');
          return mongoose;
        })
        .catch((error) => {
          console.error('MongoDB 連接失敗，使用模擬連接:', error);
          // 如果連接失敗，使用模擬連接
          return createMockConnection();
        });
    }
  }

  // 等待連接完成
  globalMongoose.conn = await globalMongoose.promise;
  return globalMongoose.conn;
}

/**
 * 斷開與 MongoDB 的連接
 * 用於清理資源
 */
export async function disconnectFromDatabase() {
  if (globalMongoose.conn && !globalMongoose.isMock) {
    await mongoose.disconnect();
    globalMongoose.conn = null;
    globalMongoose.promise = null;
    globalMongoose.isMock = false;
    console.log('已斷開與 MongoDB 的連接');
  }
}

// 檢查是否使用模擬連接
export function isUsingMockConnection() {
  return globalMongoose.isMock;
}

export default connectToDatabase; 