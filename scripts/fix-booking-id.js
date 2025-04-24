const fs = require('fs');
const path = require('path');

console.log('開始修復 [bookingId] 頁面...');

// 檢查和修復 bookings/[bookingId]/page.tsx 文件
const bookingIdPagePath = path.join(process.cwd(), 'app/bookings/[bookingId]/page.tsx');
if (!fs.existsSync(bookingIdPagePath)) {
  console.error('❌ 找不到 [bookingId]/page.tsx 文件');
  process.exit(1);
}

// 讀取文件內容
let content = fs.readFileSync(bookingIdPagePath, 'utf8');

// 1. 修正 AuthContext 的引用路徑
content = content.replace(
  /import\s*{\s*useAuth\s*}\s*from\s*['"].*?['"]/,
  "import { useAuth } from '@/app/contexts/AuthContext'"
);

// 2. 修正 CurrencyContext 的引用路徑
content = content.replace(
  /import\s*{\s*useCurrency\s*}\s*from\s*['"].*?['"]/,
  "import { useCurrency } from '@/app/contexts/CurrencyContext'"
);

// 3. 確保使用 authLoading 而不是 isLoading
content = content.replace(
  /const\s*{\s*isLoggedIn,\s*user,\s*isLoading\s*(?::\s*isLoading)?\s*}\s*=\s*useAuth\(\)/,
  "const { isLoggedIn, user, isLoading: authLoading } = useAuth()"
);

// 4. 將 pageLoading 更改為 loading
content = content.replace(/\bpageLoading\b/g, "loading");

// 保存文件
fs.writeFileSync(bookingIdPagePath, content);
console.log('✅ 已修復 [bookingId]/page.tsx 文件');

// 嘗試直接構建
console.log('開始構建...');
try {
  const { execSync } = require('child_process');
  
  // 設置環境變數跳過預構建
  process.env.SKIP_PREBUILD = 'true';
  
  // 直接執行 next build 而不使用 npm run build
  execSync('npx next build', {
    stdio: 'inherit',
    env: {...process.env}
  });
  
  console.log('✅ 構建成功');
} catch (error) {
  console.error('❌ 構建失敗:', error.message);
} 