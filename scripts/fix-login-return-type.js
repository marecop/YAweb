const fs = require('fs');
const path = require('path');

console.log('開始修復登入頁面中的 login 函數返回值問題...');

// 修復登入頁面
function fixLoginPage() {
  const loginPagePath = path.join(process.cwd(), 'app/auth/login/page.tsx');
  
  // 檢查文件是否存在
  if (!fs.existsSync(loginPagePath)) {
    console.error('找不到 login/page.tsx 文件');
    return false;
  }
  
  console.log('正在讀取 login/page.tsx...');
  
  // 讀取文件內容
  let content = fs.readFileSync(loginPagePath, 'utf8');
  const originalContent = content;
  
  // 修改 login 返回值的處理方式
  if (content.includes('const success = await login(email, password)')) {
    console.log('修改登入處理方法...');
    
    // 修改 login 函數的使用方式
    content = content.replace(
      'const success = await login(email, password);',
      'const loginResult = await login(email, password);'
    );
    
    // 修改 console.log 調用中的變量名
    content = content.replace(
      "console.log('登入結果:', success);",
      "console.log('登入結果:', loginResult);"
    );
    
    // 修改條件判斷
    content = content.replace(
      'if (success) {',
      'if (loginResult === true) {'
    );
  }
  
  // 處理 clearError
  if (content.includes('clearError }') || content.includes('clearError,')) {
    console.log('找到 clearError 引用，移除它');
    
    // 從解構賦值中移除 clearError
    content = content.replace(
      /const \{ login, isLoading: loading, error, clearError \} = useAuth\(\);/,
      'const { login, isLoading: loading, error } = useAuth();'
    );
    
    // 然後移除對 clearError 的調用
    content = content.replace(
      /clearError\(\);/g,
      '// clearError removed'
    );
  }
  
  // 如果內容已更改，保存文件
  if (content !== originalContent) {
    console.log('修復 login/page.tsx 並保存...');
    fs.writeFileSync(loginPagePath, content, 'utf8');
    return true;
  } else {
    console.log('login/page.tsx 沒有需要修復的問題');
    return false;
  }
}

// 修復 AuthContext 中的 login 函數返回類型確保一致
function fixAuthContextLoginType() {
  const authContextPath = path.join(process.cwd(), 'app/contexts/AuthContext.tsx');
  
  // 檢查文件是否存在
  if (!fs.existsSync(authContextPath)) {
    console.error('找不到 AuthContext.tsx 文件');
    return false;
  }
  
  console.log('正在讀取 AuthContext.tsx...');
  
  // 讀取文件內容
  let content = fs.readFileSync(authContextPath, 'utf8');
  const originalContent = content;
  
  let modified = false;
  
  // 確保 login 函數一定返回 boolean 而不是可能的 void
  if (content.includes('handleLogin = async') || content.includes('handleLogin =')) {
    console.log('確保 login 函數總是顯式返回 boolean 值...');
    
    // 確保函數總是顯式返回 boolean 值
    content = content.replace(
      /setLoading\(false\);(\s*)(return false;)?/g,
      'setLoading(false);\n        return false;'
    );
    
    content = content.replace(
      /setUser\(userData\);(\s*)(return true;)?/g,
      'setUser(userData);\n        return true;'
    );
    
    // 確保 Promise<boolean> 類型明確定義
    content = content.replace(
      /handleLogin\s*=\s*async\s*\(email: string, password: string\)[^{]*/,
      'handleLogin = async (email: string, password: string): Promise<boolean> '
    );
    
    // 在 interface 中確保 login 類型正確
    content = content.replace(
      /login:\s*\(email: string, password: string\)\s*=>\s*Promise<[^>]*>/,
      'login: (email: string, password: string) => Promise<boolean>'
    );
    
    modified = true;
  }
  
  // 明確強制類型檢查
  if (content.includes('const contextValue')) {
    console.log('確保 contextValue 中的 login 函數明確定義為 Promise<boolean>...');
    content = content.replace(
      /login: handleLogin,/,
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
    console.log('AuthContext.tsx 沒有需要修復的問題');
    return false;
  }
}

// 直接修復登入頁面的現有問題
function directFixLoginPage() {
  const loginPagePath = path.join(process.cwd(), 'app/auth/login/page.tsx');
  
  // 檢查文件是否存在
  if (!fs.existsSync(loginPagePath)) {
    console.error('找不到 login/page.tsx 文件');
    return false;
  }
  
  console.log('直接修復 login/page.tsx 中的變量名問題...');
  
  // 讀取文件內容
  let content = fs.readFileSync(loginPagePath, 'utf8');
  const originalContent = content;
  
  // 修復 console.log 中的變量名問題 - 不再需要檢查 const loginResult 是否存在
  if (content.includes("console.log('登入結果:', success)")) {
    content = content.replace(
      "console.log('登入結果:', success);",
      "console.log('登入結果:', loginResult);"
    );
  }
  
  // 如果內容已更改，保存文件
  if (content !== originalContent) {
    console.log('直接修復 login/page.tsx 中的變量名問題並保存...');
    fs.writeFileSync(loginPagePath, content, 'utf8');
    return true;
  } else {
    console.log('login/page.tsx 中沒有發現變量名不一致的問題');
    return false;
  }
}

// 執行修復
let fixedCount = 0;

if (fixLoginPage()) {
  fixedCount++;
} else if (directFixLoginPage()) {
  // 嘗試直接修復可能已經部分修改的文件
  fixedCount++;
}

if (fixAuthContextLoginType()) {
  fixedCount++;
}

console.log(`修復完成，共修復了 ${fixedCount} 個文件。`);