#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const registerPagePath = path.join(process.cwd(), 'app', 'auth', 'register', 'page.tsx');

console.log('開始修復註冊頁面中的 isLoading 變數問題...');

// 確認檔案存在
if (!fs.existsSync(registerPagePath)) {
  console.error(`❌ 找不到註冊頁面: ${registerPagePath}`);
  process.exit(1);
}

// 讀取檔案內容
let content = fs.readFileSync(registerPagePath, 'utf8');

// 檢查是否包含 isLoading 變數
if (content.includes('const { register, isLoading }')) {
  console.log('✅ 找到 isLoading 變數，正在修改為 loading...');
  
  // 替換變數名稱
  content = content.replace(
    'const { register, isLoading } = useAuth();',
    'const { register, loading } = useAuth();'
  );
  
  // 寫回檔案
  fs.writeFileSync(registerPagePath, content, 'utf8');
  console.log('✅ 變數名稱已成功修改');
  
  // 檢查是否還有其他 isLoading 的使用
  if (content.includes('isLoading')) {
    console.log('⚠️ 警告: 檔案中仍有其他 isLoading 的使用，請檢查以下行:');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('isLoading')) {
        console.log(`行 ${index + 1}: ${line.trim()}`);
      }
    });
  } else {
    console.log('✅ 檔案中不再有任何 isLoading 的使用');
  }
} else {
  console.log('ℹ️ 檔案中未找到 "const { register, isLoading }" 模式');
  
  // 檢查是否已經修改為 loading
  if (content.includes('const { register, loading }')) {
    console.log('✅ 檔案中已經使用了 loading 變數名稱');
  } else {
    console.log('⚠️ 警告: 未找到預期的變數模式，請手動檢查檔案');
  }
}

console.log('註冊頁面修復完成！'); 