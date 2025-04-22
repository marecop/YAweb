/**
 * 此腳本專門修復登入相關檔案中的類型檢查問題，
 * 特別是解決 void 和 boolean 類型比較的錯誤
 */

const fs = require('fs');
const path = require('path');

console.log('開始修復登入/註冊頁面的類型檢查問題...');

// 修復登入頁面的登入結果檢查
function fixLoginPage() {
  const loginPagePath = path.join(process.cwd(), 'app/auth/login/page.tsx');
  
  if (!fs.existsSync(loginPagePath)) {
    console.log('找不到登入頁面文件');
    return false;
  }
  
  console.log('正在修復登入頁面...');
  let content = fs.readFileSync(loginPagePath, 'utf8');
  let modified = false;
  
  // 修改嚴格比較為真值檢查
  const strictComparisonRegex = /if\s*\(\s*loginResult\s*===\s*true\s*\)/;
  if (strictComparisonRegex.test(content)) {
    content = content.replace(strictComparisonRegex, 'if (loginResult)');
    modified = true;
  }
  
  // 確保使用標準的 try-catch 結構
  const loginResultRegex = /const\s+loginResult\s*=\s*await\s+login\([^)]*\);(?!\s*try\s*\{)/;
  if (loginResultRegex.test(content)) {
    // 添加註解說明
    content = content.replace(
      loginResultRegex,
      '// 先獲取登入結果並存儲，確保它不是 void 類型\n      const loginResult = await login($1);'
    );
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(loginPagePath, content, 'utf8');
    console.log('✅ 已修復登入頁面');
    return true;
  } else {
    console.log('⚠️ 登入頁面沒有發現需要修復的問題');
    return false;
  }
}

// 修復註冊頁面的註冊結果檢查
function fixRegisterPage() {
  const registerPagePath = path.join(process.cwd(), 'app/auth/register/page.tsx');
  
  if (!fs.existsSync(registerPagePath)) {
    console.log('找不到註冊頁面文件');
    return false;
  }
  
  console.log('正在修復註冊頁面...');
  let content = fs.readFileSync(registerPagePath, 'utf8');
  let modified = false;
  
  // 修改 response.success 檢查為直接檢查結果的真假值
  const successCheckRegex = /const\s+(\w+)\s*=\s*await\s+register\([^)]*\);\s*[\r\n\s]*if\s*\(\s*\1\.success\s*\)/;
  if (successCheckRegex.test(content)) {
    content = content.replace(
      successCheckRegex,
      (match, varName) => {
        return `// 調用註冊功能\n      const ${varName} = await register($1);\n      \n      // 使用真值檢查而不是屬性訪問\n      if (${varName})`;
      }
    );
    modified = true;
  }
  
  // 移除 response.error 的訪問，因為它可能不存在
  const errorAccessRegex = /setError\s*\(\s*(\w+)\.error\s*\|\|\s*(['"])([^'"]*)['"]\s*\)/;
  if (errorAccessRegex.test(content)) {
    content = content.replace(
      errorAccessRegex,
      (match, varName, quote, defaultMsg) => {
        return `setError(${quote}${defaultMsg}${quote})`;
      }
    );
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(registerPagePath, content, 'utf8');
    console.log('✅ 已修復註冊頁面');
    return true;
  } else {
    console.log('⚠️ 註冊頁面沒有發現需要修復的問題');
    return false;
  }
}

// 修復 AuthContext 中的方法返回類型
function fixAuthContext() {
  const authContextPath = path.join(process.cwd(), 'app/contexts/AuthContext.tsx');
  
  if (!fs.existsSync(authContextPath)) {
    console.log('找不到 AuthContext.tsx 文件');
    return false;
  }
  
  console.log('正在修復 AuthContext...');
  let content = fs.readFileSync(authContextPath, 'utf8');
  let modified = false;
  
  // 確保 login 方法在接口定義中返回 boolean
  const loginTypeRegex = /(login\s*:\s*\([^)]*\)\s*=>\s*)Promise<[^>]*>/;
  if (loginTypeRegex.test(content)) {
    content = content.replace(loginTypeRegex, '$1Promise<boolean>');
    modified = true;
  }
  
  // 確保 register 方法在接口定義中返回 boolean
  const registerTypeRegex = /(register\s*:\s*\([^)]*\)\s*=>\s*)Promise<[^>]*>/;
  if (registerTypeRegex.test(content)) {
    content = content.replace(registerTypeRegex, '$1Promise<boolean>');
    modified = true;
  }
  
  // 確保 handleLogin 函數返回 boolean
  const handleLoginRegex = /(const\s+handleLogin\s*=\s*async\s*\([^)]*\)\s*:\s*)Promise<[^>]*>/;
  if (handleLoginRegex.test(content)) {
    content = content.replace(handleLoginRegex, '$1Promise<boolean>');
    modified = true;
  }
  
  // 確保 handleRegister 函數返回 boolean
  const handleRegisterRegex = /(const\s+handleRegister\s*=\s*async\s*\([^)]*\)\s*:\s*)Promise<[^>]*>/;
  if (handleRegisterRegex.test(content)) {
    content = content.replace(handleRegisterRegex, '$1Promise<boolean>');
    modified = true;
  }
  
  // 修正任何返回物件的地方，改為返回布爾值
  const returnObjectRegex = /return\s*\{\s*success:\s*(true|false)(?:[^}]*)\};/g;
  if (returnObjectRegex.test(content)) {
    content = content.replace(returnObjectRegex, (match, value) => {
      return `return ${value};`;
    });
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(authContextPath, content, 'utf8');
    console.log('✅ 已修復 AuthContext');
    return true;
  } else {
    console.log('⚠️ AuthContext 沒有發現需要修復的問題');
    return false;
  }
}

// 執行修復
let fixedFiles = 0;

if (fixLoginPage()) fixedFiles++;
if (fixRegisterPage()) fixedFiles++;
if (fixAuthContext()) fixedFiles++;

console.log(`修復完成，共修復了 ${fixedFiles} 個文件`); 