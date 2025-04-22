/**
 * 此腳本用於確保MongoDB連接設置正確
 */

const fs = require('fs');
const path = require('path');

console.log('============================');
console.log('檢查與修正MongoDB連接設置...');
console.log('============================');

// 確保.env和.env.local文件包含MongoDB連接設置
const envFilePath = path.join(process.cwd(), '.env');
const envLocalFilePath = path.join(process.cwd(), '.env.local');

// MongoDB連接信息
const mongoDBConfig = `
# MongoDB 配置
MONGODB_URI=mongodb+srv://yelluser:yell2024pass@cluster0.atvupvb.mongodb.net/yellairlines?retryWrites=true&w=majority
# 設置為true使用模擬數據庫，false使用真實連接
USE_MOCK_DB=false
JWT_SECRET=yellow_airlines_jwt_secret_key_2024
`;

// 創建或更新.env文件
if (!fs.existsSync(envFilePath)) {
  console.log('創建新的.env文件...');
  fs.writeFileSync(envFilePath, mongoDBConfig, 'utf8');
} else {
  let envContent = fs.readFileSync(envFilePath, 'utf8');
  if (!envContent.includes('MONGODB_URI=')) {
    console.log('更新.env文件，添加MongoDB配置...');
    fs.writeFileSync(envFilePath, envContent + '\n' + mongoDBConfig, 'utf8');
  } else {
    console.log('.env文件已包含MongoDB配置');
  }
}

// 創建或更新.env.local文件
if (!fs.existsSync(envLocalFilePath)) {
  console.log('創建新的.env.local文件...');
  fs.writeFileSync(envLocalFilePath, mongoDBConfig, 'utf8');
} else {
  let envLocalContent = fs.readFileSync(envLocalFilePath, 'utf8');
  if (!envLocalContent.includes('MONGODB_URI=')) {
    console.log('更新.env.local文件，添加MongoDB配置...');
    fs.writeFileSync(envLocalFilePath, envLocalContent + '\n' + mongoDBConfig, 'utf8');
  } else {
    console.log('.env.local文件已包含MongoDB配置');
  }
}

// 檢查並更新MongoDB連接配置文件
const mongodbFilePath = path.join(process.cwd(), 'app', 'lib', 'mongodb.ts');
if (fs.existsSync(mongodbFilePath)) {
  let mongodbContent = fs.readFileSync(mongodbFilePath, 'utf8');
  
  // 修正MongoDB連接字符串
  const updatedContent = mongodbContent.replace(
    /const MONGODB_URI = process\.env\.MONGODB_URI \|\| ['"]mongodb\+srv:\/\/[^"']+['"];/g, 
    'const MONGODB_URI = process.env.MONGODB_URI || \'mongodb+srv://yelluser:yell2024pass@cluster0.atvupvb.mongodb.net/yellairlines?retryWrites=true&w=majority\';'
  );
  
  // 檢查是否實際做了修改
  if (updatedContent !== mongodbContent) {
    console.log('更新MongoDB連接字符串配置...');
    fs.writeFileSync(mongodbFilePath, updatedContent, 'utf8');
  } else {
    console.log('MongoDB連接字符串配置已是最新');
  }
  
  // 確保有getMongoDBConfig函數
  if (!mongodbContent.includes('getMongoDBConfig')) {
    console.log('添加getMongoDBConfig函數到mongodb.ts...');
    
    // 找到文件的末尾，但在export default之前
    const exportDefaultIndex = mongodbContent.lastIndexOf('export default');
    if (exportDefaultIndex !== -1) {
      const configFunction = `
// 環境變數檢查和配置
export function getMongoDBConfig() {
  const isProduction = process.env.NODE_ENV === 'production';
  const useMockDB = process.env.USE_MOCK_DB === 'true';
  const mongodbUri = process.env.MONGODB_URI || 'mongodb+srv://yelluser:yell2024pass@cluster0.atvupvb.mongodb.net/yellairlines?retryWrites=true&w=majority';
  
  return {
    isProduction,
    useMockDB,
    mongodbUri,
    shouldUseMockDB: useMockDB || !mongodbUri.includes('mongodb')
  };
}
`;
      
      // 在export default之前添加配置函數
      const newContent = mongodbContent.slice(0, exportDefaultIndex) + configFunction + mongodbContent.slice(exportDefaultIndex);
      fs.writeFileSync(mongodbFilePath, newContent, 'utf8');
    }
  } else {
    console.log('mongodb.ts已包含getMongoDBConfig函數');
  }
}

console.log('============================');
console.log('MongoDB連接設置檢查與修正完成');
console.log('============================'); 