/**
 * 此腳本用於修復miles頁面中的isLoading屬性不匹配問題
 */

const fs = require('fs');
const path = require('path');

console.log('開始修復miles頁面中的isLoading屬性...');

const milesPagePath = path.join(process.cwd(), 'app/member/miles/page.tsx');

if (fs.existsSync(milesPagePath)) {
  console.log(`找到miles頁面：${milesPagePath}`);
  
  // 讀取文件內容
  let content = fs.readFileSync(milesPagePath, 'utf8');
  
  // 檢查並修復解構賦值
  if (content.includes('{ isLoggedIn, loading, user }')) {
    console.log('找到不正確的解構賦值，進行修復...');
    
    // 替換loading為isLoading，修復屬性名稱
    content = content.replace(
      /const\s*{\s*isLoggedIn\s*,\s*loading\s*,\s*user\s*}\s*=\s*useAuth\(\)/g,
      'const { isLoggedIn, isLoading, user } = useAuth()'
    );
    
    // 替換其他相關的loading變量引用
    content = content.replace(/if\s*\(\s*loading\s*\)/g, 'if (isLoading)');
    
    // 寫入修改後的內容
    fs.writeFileSync(milesPagePath, content, 'utf8');
    console.log('✅ 已修復miles頁面中的isLoading屬性');
  } else {
    console.log('⚠️ 未找到需要修復的isLoading屬性');
  }
} else {
  console.error(`❌ 找不到miles頁面：${milesPagePath}`);
}

console.log('miles頁面屬性修復完成'); 