/**
 * 此腳本用於修復CSS模組引用路徑問題
 */

const fs = require('fs');
const path = require('path');

console.log('開始修復CSS模組引用問題...');

// 修復註冊頁面中的CSS引用
function fixRegisterPage() {
  const registerPagePath = path.join(process.cwd(), 'app/auth/register/page.tsx');
  
  if (!fs.existsSync(registerPagePath)) {
    console.log('找不到註冊頁面文件');
    return false;
  }
  
  console.log('正在修復註冊頁面的CSS引用...');
  let content = fs.readFileSync(registerPagePath, 'utf8');
  
  // 刪除腳本中任何可能將className="..."改為className={styles...的代碼
  // 確保使用標準Tailwind類名格式
  
  // 檢查是否有不正確的className格式，如果有就修正
  const incorrectClassNamePattern = /className=\{styles\.([^}]+)"\}/g;
  const incorrectClassNamePattern2 = /className=\{styles\.([^}]+)\}/g;
  
  if (content.match(incorrectClassNamePattern) || content.match(incorrectClassNamePattern2)) {
    console.log('發現不正確的className格式，進行修復...');
    
    // 修正格式1: className={styles.xxx"}
    content = content.replace(incorrectClassNamePattern, 'className="$1"');
    
    // 修正格式2: className={styles.xxx}
    content = content.replace(incorrectClassNamePattern2, 'className="$1"');
    
    // 寫回文件
    fs.writeFileSync(registerPagePath, content, 'utf8');
    console.log('✅ 已修復註冊頁面中不正確的className格式');
    return true;
  }
  
  console.log('⚠️ 註冊頁面沒有發現需要修復的問題');
  return false;
}

// 執行修復
let fixedFiles = 0;

if (fixRegisterPage()) fixedFiles++;

console.log(`修復完成，共修復了 ${fixedFiles} 個文件`); 