/**
 * 此腳本專門處理Render平台上的緩存問題
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('開始修復Render緩存問題...');

// 在Render環境中執行
if (process.env.RENDER) {
  console.log('檢測到Render環境，開始執行特定修復...');
  
  // 創建.env.local文件，指示Next.js禁用緩存
  const envLocalPath = path.join(process.cwd(), '.env.local');
  try {
    const envContent = 'NEXT_DISABLE_CACHE=1\n';
    fs.writeFileSync(envLocalPath, envContent, 'utf8');
    console.log('✅ 創建.env.local文件並禁用Next.js緩存');
  } catch (error) {
    console.error('創建.env.local文件時出錯:', error);
  }
  
  // 檢查是否需要重新安裝依賴
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (!fs.existsSync(nodeModulesPath) || !fs.readdirSync(nodeModulesPath).length) {
    console.log('未找到node_modules或為空，開始重新安裝依賴...');
    try {
      execSync('npm install --no-cache', { stdio: 'inherit' });
      console.log('✅ 依賴重新安裝完成');
    } catch (error) {
      console.error('重新安裝依賴時出錯:', error);
    }
  }
  
  // 確保.next目錄存在並為空
  const nextDir = path.join(process.cwd(), '.next');
  try {
    if (fs.existsSync(nextDir)) {
      // 刪除.next目錄
      execSync(`rm -rf "${nextDir}"`, { stdio: 'inherit' });
    }
    
    // 創建新的.next目錄
    fs.mkdirSync(nextDir, { recursive: true });
    console.log('✅ 重置.next目錄');
  } catch (error) {
    console.error('重置.next目錄時出錯:', error);
  }
  
  // 創建空的build-manifest.json文件
  const buildManifestPath = path.join(nextDir, 'build-manifest.json');
  try {
    fs.writeFileSync(buildManifestPath, '{}', 'utf8');
    console.log('✅ 創建空的build-manifest.json文件');
  } catch (error) {
    console.error('創建build-manifest.json文件時出錯:', error);
  }
  
  console.log('Render緩存修復完成！');
} else {
  console.log('非Render環境，跳過特定修復步驟。');
} 