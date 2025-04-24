#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const bookingsPagePath = path.join(process.cwd(), 'app', 'bookings', 'page.tsx');

console.log('開始修復預訂頁面中的 Loading 變數問題...');

// 確認檔案存在
if (!fs.existsSync(bookingsPagePath)) {
  console.error(`❌ 找不到預訂頁面: ${bookingsPagePath}`);
  process.exit(1);
}

// 讀取檔案內容
let content = fs.readFileSync(bookingsPagePath, 'utf8');

// 修正 #1: 修復 Loading 解構變數名稱
content = content.replace(
  /const {isLoggedIn, user, Loading: authloading} = useAuth\(\);/g,
  'const {isLoggedIn, user, loading: authLoading} = useAuth();'
);

// 檢查 authLoading 變數名稱在 useEffect 和條件判斷中是否已修正
if (content.includes('authLoading')) {
  console.log('✅ authLoading 變數名稱已經存在，無需修改');
} else {
  console.log('⚠️ 警告: authLoading 變數名稱不一致');
}

// 寫回檔案
fs.writeFileSync(bookingsPagePath, content, 'utf8');
console.log('✅ 變數名稱已成功修改');

console.log('預訂頁面修復完成！'); 