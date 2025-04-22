/**
 * 此腳本用於處理緩存問題
 * 確保在部署過程中刪除和重新初始化緩存
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('開始清理緩存...');

// 清理 .next 目錄
const nextCacheDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextCacheDir)) {
  console.log('刪除 .next 目錄...');
  try {
    if (process.platform === 'win32') {
      execSync(`rmdir /s /q "${nextCacheDir}"`);
    } else {
      execSync(`rm -rf "${nextCacheDir}"`);
    }
    console.log('✅ .next 目錄已刪除');
  } catch (error) {
    console.error('刪除 .next 目錄時出錯:', error);
  }
}

// 清理 node_modules/.cache 目錄
const moduleCacheDir = path.join(process.cwd(), 'node_modules', '.cache');
if (fs.existsSync(moduleCacheDir)) {
  console.log('刪除 node_modules/.cache 目錄...');
  try {
    if (process.platform === 'win32') {
      execSync(`rmdir /s /q "${moduleCacheDir}"`);
    } else {
      execSync(`rm -rf "${moduleCacheDir}"`);
    }
    console.log('✅ node_modules/.cache 目錄已刪除');
  } catch (error) {
    console.error('刪除 node_modules/.cache 目錄時出錯:', error);
  }
}

// 創建空的 .nextignore 文件
// 這有助於解決某些緩存問題
const nextIgnorePath = path.join(process.cwd(), '.nextignore');
try {
  fs.writeFileSync(nextIgnorePath, '# 緩存管理\n.next/cache\nnode_modules/.cache', 'utf8');
  console.log('✅ 創建 .nextignore 文件');
} catch (error) {
  console.error('創建 .nextignore 文件時出錯:', error);
}

// 創建一個空的 .next 目錄，以確保後續步驟不會因為缺少目錄而失敗
if (!fs.existsSync(nextCacheDir)) {
  try {
    fs.mkdirSync(nextCacheDir, { recursive: true });
    console.log('✅ 創建空的 .next 目錄');
  } catch (error) {
    console.error('創建 .next 目錄時出錯:', error);
  }
}

console.log('緩存清理完成！'); 