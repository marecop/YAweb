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
    
    // 修改條件判斷
    content = content.replace(
      'if (success) {',
      'if (loginResult === true) {'
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
  
  // 確保 login 函數一定返回 boolean 而不是可能的 void
  if (content.includes('setLoading(false);') && content.includes('handleLogin')) {
    console.log('確保 login 函數總是返回 boolean 值...');
    
    // 確保總是有返回值
    content = content.replace(
      /setLoading\(false\);(\s*)return false;/g,
      'setLoading(false);\n        return false;'
    );
    
    // 確保 Promise<boolean> 類型明確定義
    content = content.replace(
      /handleLogin = async \(email: string, password: string\): Promise<boolean>/g,
      'handleLogin = async (email: string, password: string): Promise<boolean>'
    );
    
    // 在 interface 中確保 login 類型正確
    content = content.replace(
      /login: \(email: string, password: string\) => Promise<[^>]*>/g,
      'login: (email: string, password: string) => Promise<boolean>'
    );
  }
  
  // 如果內容已更改，保存文件
  if (content !== originalContent) {
    console.log('修復 AuthContext.tsx 並保存...');
    fs.writeFileSync(authContextPath, content, 'utf8');
    return true;
  } else {
    console.log('AuthContext.tsx 沒有需要修復的問題');
    return false;
  }
}

// 執行修復
let fixedCount = 0;

if (fixLoginPage()) {
  fixedCount++;
}

if (fixAuthContextLoginType()) {
  fixedCount++;
}

console.log(`修復完成，共修復了 ${fixedCount} 個文件。`); 