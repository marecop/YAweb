/**
 * 此腳本用於修復會員相關頁面中的isLoading屬性不匹配問題
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('開始修復會員相關頁面中的isLoading屬性...');

// 要檢查的目錄
const directoriesToCheck = [
  'app/member/**/*.tsx',
  'app/bookings/**/*.tsx',
  'app/auth/**/*.tsx'
];

// 計數器
let fixedCount = 0;
let checkedCount = 0;

// 修復loading屬性
function fixLoadingAttribute(filePath) {
  checkedCount++;
  console.log(`檢查文件：${filePath}`);
  
  // 讀取文件內容
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // 檢查並修復解構賦值
  if (content.includes('{ isLoggedIn, loading,') || 
      content.match(/{\s*[^}]*\bloading\b[^}]*}/)) {
    console.log(`發現不正確的loading屬性解構賦值，修復文件：${filePath}`);
    
    // 替換loading為isLoading，修復屬性名稱
    content = content.replace(
      /const\s*{\s*([^}]*)\bloading\b([^}]*)\}\s*=\s*useAuth\(\)/g,
      'const {$1isLoading$2} = useAuth()'
    );
    
    // 替換獨立的loading變量引用
    content = content.replace(/\bloading\b(?!\s*[.:=])/g, 'isLoading');
    
    // 檢查是否有實際變化
    if (content !== originalContent) {
      // 寫入修改後的內容
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ 已修復文件：${filePath}`);
      fixedCount++;
    } else {
      console.log(`⚠️ 檢測到可能問題但未做更改：${filePath}`);
    }
  }
}

// 處理所有文件
try {
  directoriesToCheck.forEach(pattern => {
    const files = glob.sync(pattern, { cwd: process.cwd() });
    files.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        fixLoadingAttribute(filePath);
      }
    });
  });
  
  console.log(`✅ 檢查完成！共檢查了 ${checkedCount} 個文件，修復了 ${fixedCount} 個文件。`);
} catch (error) {
  console.error('❌ 處理過程中發生錯誤:', error);
}

console.log('會員相關頁面屬性修復完成'); 