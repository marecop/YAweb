#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const authContextPath = path.join(process.cwd(), 'app', 'contexts', 'AuthContext.tsx');

console.log('開始修復 AuthContext 中缺少 isLoggedIn 屬性的問題...');

// 確認檔案存在
if (!fs.existsSync(authContextPath)) {
  console.error(`❌ 找不到 AuthContext 檔案: ${authContextPath}`);
  process.exit(1);
}

// 讀取檔案內容
let content = fs.readFileSync(authContextPath, 'utf8');

// 檢查 AuthContextType 介面
if (content.includes('interface AuthContextType {')) {
  console.log('✅ 找到 AuthContextType 介面定義');
  
  // 1. 在 AuthContextType 介面中添加 isLoggedIn 屬性
  content = content.replace(
    'interface AuthContextType {',
    'interface AuthContextType {\n  isLoggedIn: boolean;'
  );
  
  // 2. 在 value 對象中添加 isLoggedIn 屬性
  content = content.replace(
    'const value = {\n    user,\n    loading,\n    error,',
    'const value = {\n    user,\n    isLoggedIn: !!user,\n    loading,\n    error,'
  );
  
  // 寫回檔案
  fs.writeFileSync(authContextPath, content, 'utf8');
  console.log('✅ 已添加 isLoggedIn 屬性到 AuthContextType 和 value 對象');
} else {
  console.log('⚠️ 未找到 AuthContextType 介面定義，請手動檢查檔案');
}

console.log('AuthContext isLoggedIn 修復完成！'); 