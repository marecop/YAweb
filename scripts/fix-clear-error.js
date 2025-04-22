const fs = require('fs');
const path = require('path');

console.log('開始修復 clearError 問題...');

// 修復登入頁面
function fixLoginPage() {
  const loginPagePath = path.join(process.cwd(), 'app/auth/login/page.tsx');
  
  // 檢查文件是否存在
  if (!fs.existsSync(loginPagePath)) {
    console.error('找不到 login/page.tsx 文件');
    return false;
  }
  
  console.log('正在修復 login/page.tsx 中的 clearError 問題...');
  
  // 讀取文件內容
  let content = fs.readFileSync(loginPagePath, 'utf8');
  const originalContent = content;
  
  // 移除 clearError 引用和調用
  let modified = false;
  
  // 檢查 useAuth 解構賦值
  if (content.includes('clearError }') || content.includes('clearError,')) {
    content = content.replace(
      /const \{([^}]*?)clearError([^}]*?)\} = useAuth\(\);/,
      'const {$1$2} = useAuth();'
    );
    modified = true;
  }
  
  // 移除 clearError() 調用
  if (content.includes('clearError();')) {
    content = content.replace(
      /clearError\(\);/g,
      '// clearError removed'
    );
    modified = true;
  }
  
  // 如果內容已更改，保存文件
  if (modified) {
    console.log('修復 login/page.tsx 並保存...');
    fs.writeFileSync(loginPagePath, content, 'utf8');
    return true;
  } else {
    console.log('login/page.tsx 沒有 clearError 問題或已經修復');
    return false;
  }
}

// 執行修復
if (fixLoginPage()) {
  console.log('成功修復 clearError 問題');
} else {
  console.log('無需修復 clearError 問題');
} 