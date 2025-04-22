/**
 * 此腳本用於修復預訂詳情頁面中的authLoading命名問題
 */

const fs = require('fs');
const path = require('path');

console.log('開始修復預訂詳情頁面中的authLoading命名問題...');

// 定義要修改的文件路徑
const bookingDetailPagePath = path.join(process.cwd(), 'app/bookings/[bookingId]/page.tsx');

if (fs.existsSync(bookingDetailPagePath)) {
  console.log(`找到預訂詳情頁面：${bookingDetailPagePath}`);
  
  // 讀取文件內容
  let content = fs.readFileSync(bookingDetailPagePath, 'utf8');
  
  // 檢查並修復解構賦值
  if (content.includes('loading: authLoading') || content.includes('isLoading: authLoading')) {
    console.log('找到不正確的解構賦值模式，進行修復...');
    
    // 處理可能出現的兩種解構形式
    content = content.replace(
      /const\s*{\s*isLoggedIn\s*,\s*user\s*,\s*loading\s*:\s*authLoading\s*}\s*=\s*useAuth\(\)/g,
      'const { isLoggedIn, user, isLoading: authLoading } = useAuth()'
    );
    
    content = content.replace(
      /const\s*{\s*isLoggedIn\s*,\s*user\s*,\s*isLoading\s*:\s*authLoading\s*}\s*=\s*useAuth\(\)/g,
      'const { isLoggedIn, user, isLoading } = useAuth()'
    );
    
    // 修改其他所有引用
    if (content.includes('isLoading: authLoading')) {
      // 修改為直接使用isLoading
      content = content.replace(/isLoading\s*:\s*authLoading/g, 'isLoading');
      
      // 將所有authLoading的引用改為isLoading
      content = content.replace(/if\s*\(\s*authLoading\s*\)/g, 'if (isLoading)');
      content = content.replace(/!authLoading/g, '!isLoading');
      
      // 如果有本地的isLoading變量，將其重命名為pageLoading
      if (content.match(/const\s*\[\s*isLoading\s*,\s*setLoading\s*\]\s*=\s*useState/)) {
        console.log('發現本地isLoading狀態變量，將其重命名為pageLoading...');
        
        // 修改useState部分
        content = content.replace(
          /const\s*\[\s*isLoading\s*,\s*setLoading\s*\]\s*=\s*useState/g,
          'const [pageLoading, setLoading] = useState'
        );
        
        // 修改使用isLoading的地方
        content = content.replace(/if\s*\(\s*loading\s*\)/g, 'if (pageLoading)');
        content = content.replace(/setLoading\s*\(\s*true\s*\)/g, 'setLoading(true)');
        content = content.replace(/setLoading\s*\(\s*false\s*\)/g, 'setLoading(false)');
      }
    }
    
    // 寫入修改後的內容
    fs.writeFileSync(bookingDetailPagePath, content, 'utf8');
    console.log('✅ 已修復預訂詳情頁面中的authLoading問題');
    
    // 確認變量名稱的一致性
    if (content.includes('authLoading') && !content.includes('isLoading: authLoading')) {
      // 將所有authLoading的引用改為isLoading
      content = content.replace(/authLoading/g, 'isLoading');
      
      // 重新寫入修改後的內容
      fs.writeFileSync(bookingDetailPagePath, content, 'utf8');
      console.log('✅ 已完全統一命名為isLoading');
    }
  } else {
    console.log('⚠️ 未找到需要修復的解構賦值模式');
  }
} else {
  console.error(`❌ 找不到預訂詳情頁面：${bookingDetailPagePath}`);
}

console.log('預訂詳情頁面修復完成'); 