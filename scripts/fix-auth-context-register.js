/**
 * 此腳本用於修復AuthContext中的register函數簽名問題
 */

const fs = require('fs');
const path = require('path');

console.log('開始修復AuthContext中的register函數簽名...');

const authContextPath = path.join(process.cwd(), 'app/contexts/AuthContext.tsx');

if (fs.existsSync(authContextPath)) {
  console.log(`找到AuthContext文件：${authContextPath}`);
  
  // 讀取文件內容
  let content = fs.readFileSync(authContextPath, 'utf8');
  
  // 1. 檢查並修復AuthContextType接口中的register函數定義
  const authContextTypePattern = /export\s+interface\s+AuthContextType\s*{[\s\S]*?register[\s\S]*?;[\s\S]*?}/;
  if (authContextTypePattern.test(content)) {
    console.log('找到AuthContextType接口，修復register函數簽名...');
    
    // 替換register函數簽名，確保只接受一個對象參數
    content = content.replace(
      /register\s*:\s*\([^)]*\)\s*=>\s*Promise<[^>]*>/,
      'register: (userData: RegisterParams) => Promise<boolean>'
    );
    
    console.log('✅ 已修復AuthContextType接口中的register函數簽名');
  }
  
  // 2. 檢查並修復handleRegister函數實現
  const handleRegisterPattern = /const\s+handleRegister\s*=\s*async\s*\([^)]*\)\s*:\s*Promise<[^>]*>/;
  if (handleRegisterPattern.test(content)) {
    console.log('找到handleRegister函數實現，檢查是否需要修復...');
    
    // 只在函數簽名不匹配時修復
    if (!content.includes('handleRegister = async (userData: RegisterParams)')) {
      content = content.replace(
        handleRegisterPattern,
        'const handleRegister = async (userData: RegisterParams): Promise<any>'
      );
      console.log('✅ 已修復handleRegister函數實現');
    } else {
      console.log('handleRegister函數簽名已正確，無需修復');
    }
  }
  
  // 寫入修改後的內容
  fs.writeFileSync(authContextPath, content, 'utf8');
  console.log(`✅ AuthContext.tsx文件已成功修復並保存`);
  
  // 修復register/page.tsx中的調用
  const registerPagePath = path.join(process.cwd(), 'app/auth/register/page.tsx');
  if (fs.existsSync(registerPagePath)) {
    console.log(`找到註冊頁面：${registerPagePath}`);
    
    let registerContent = fs.readFileSync(registerPagePath, 'utf8');
    
    // 檢查調用方式並修復
    if (registerContent.includes('await register(')) {
      if (!registerContent.includes('await register({')) {
        console.log('修復註冊頁面中的register函數調用...');
        
        // 替換調用方式，確保使用對象參數
        registerContent = registerContent.replace(
          /await\s+register\s*\(\s*formData\.firstName\s*,\s*formData\.lastName\s*,\s*formData\.email\s*,\s*formData\.password\s*\)/,
          `await register({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password
          })`
        );
        
        fs.writeFileSync(registerPagePath, registerContent, 'utf8');
        console.log('✅ 註冊頁面中的register函數調用已修復');
      } else {
        console.log('註冊頁面中的register函數調用已正確，無需修復');
      }
    }
  }
} else {
  console.error(`❌ 找不到AuthContext文件：${authContextPath}`);
}

console.log('AuthContext修復完成'); 