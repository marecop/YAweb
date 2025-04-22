const fs = require('fs');
const path = require('path');

console.log('開始修復 login 函數返回類型問題...');

// 修復 AuthContext 中的 login 函數
function fixAuthContextLoginType() {
  const authContextPath = path.join(process.cwd(), 'app/contexts/AuthContext.tsx');
  
  // 檢查文件是否存在
  if (!fs.existsSync(authContextPath)) {
    console.error('找不到 AuthContext.tsx 文件');
    return false;
  }
  
  console.log('正在修復 AuthContext.tsx 中的 login 函數返回類型...');
  
  // 讀取文件內容
  let content = fs.readFileSync(authContextPath, 'utf8');
  const originalContent = content;
  
  let modified = false;
  
  // 檢查 AuthContextType 接口
  if (content.includes('export interface AuthContextType')) {
    console.log('修復 AuthContextType 接口中的 login 函數類型...');
    content = content.replace(
      /login:\s*\(email: string, password: string\)\s*=>\s*Promise<[^>]*>/,
      'login: (email: string, password: string) => Promise<boolean>'
    );
    modified = true;
  }
  
  // 檢查 handleLogin 函數
  if (content.includes('handleLogin = async')) {
    console.log('修復 handleLogin 函數的返回類型...');
    
    // 確保函數聲明包含明確的返回類型
    content = content.replace(
      /handleLogin\s*=\s*async\s*\(email: string, password: string\)[^{]*/,
      'handleLogin = async (email: string, password: string): Promise<boolean> '
    );
    
    // 確保所有路徑都顯式返回 boolean
    content = content.replace(
      /setLoading\(false\);(\s*)(?!return)/g,
      'setLoading(false);\n        return false;'
    );
    
    // 確保登入成功時返回 true
    content = content.replace(
      /setLastRefreshTime\(Date\.now\(\)\);(\s*)(?!return true)/g,
      'setLastRefreshTime(Date.now());\n        return true;'
    );
    
    modified = true;
  }
  
  // 檢查 contextValue
  if (content.includes('const contextValue')) {
    console.log('修復 contextValue 中的 login 屬性...');
    content = content.replace(
      /login:\s*handleLogin,/,
      'login: handleLogin as (email: string, password: string) => Promise<boolean>,'
    );
    modified = true;
  }
  
  // 如果內容已更改，保存文件
  if (modified) {
    console.log('修復 AuthContext.tsx 並保存...');
    fs.writeFileSync(authContextPath, content, 'utf8');
    return true;
  } else {
    console.log('AuthContext.tsx 的 login 函數返回類型已正確');
    return false;
  }
}

// 修復登入頁面
function fixLoginPage() {
  const loginPagePath = path.join(process.cwd(), 'app/auth/login/page.tsx');
  
  // 檢查文件是否存在
  if (!fs.existsSync(loginPagePath)) {
    console.error('找不到 login/page.tsx 文件');
    return false;
  }
  
  console.log('正在修復 login/page.tsx 中的 login 函數使用...');
  
  // 讀取文件內容
  let content = fs.readFileSync(loginPagePath, 'utf8');
  const originalContent = content;
  
  // 修改 login 結果的檢查方式
  let modified = false;
  
  if (content.includes('if (loginResult)')) {
    console.log('修改 loginResult 的檢查方式，使用嚴格相等...');
    content = content.replace(
      /if\s*\(loginResult\)\s*{/,
      'if (loginResult === true) {'
    );
    modified = true;
  }
  
  // 如果內容已更改，保存文件
  if (modified) {
    console.log('修復 login/page.tsx 並保存...');
    fs.writeFileSync(loginPagePath, content, 'utf8');
    return true;
  } else {
    console.log('login/page.tsx 中已正確檢查 loginResult');
    return false;
  }
}

// 執行修復
let fixedCount = 0;

if (fixAuthContextLoginType()) {
  fixedCount++;
}

if (fixLoginPage()) {
  fixedCount++;
}

console.log(`修復完成，共修復了 ${fixedCount} 個文件。`); 