const fs = require('fs');
const path = require('path');

// 主函數
async function fixUserTypeIssues() {
  console.log('開始修復 User 類型重複定義問題...');
  
  // 檢查並修改 app/lib/auth.ts 文件
  const authLibPath = path.join(process.cwd(), 'app/lib/auth.ts');
  
  if (!fs.existsSync(authLibPath)) {
    console.error('無法找到 app/lib/auth.ts 文件');
    return;
  }
  
  let authLibContent = fs.readFileSync(authLibPath, 'utf8');
  
  // 將 User 類型改名為 AuthUser
  console.log('修改 app/lib/auth.ts 中的 User 類型為 AuthUser...');
  
  const updatedAuthLibContent = authLibContent.replace(
    /export\s+type\s+User\s*=/,
    'export type AuthUser ='
  ).replace(
    /User(?=\s*\{|:|\[\]|<|>|\(|\)|,)/g,
    'AuthUser'
  );
  
  fs.writeFileSync(authLibPath, updatedAuthLibContent, 'utf8');
  console.log('✅ 已修改 app/lib/auth.ts 文件');
  
  // 修復 AuthContext.tsx 中的引用
  const authContextPath = path.join(process.cwd(), 'app/contexts/AuthContext.tsx');
  
  if (fs.existsSync(authContextPath)) {
    let authContextContent = fs.readFileSync(authContextPath, 'utf8');
    
    // 更新 import 和類型引用
    const updatedAuthContextContent = authContextContent.replace(
      /import\s*{(?:[^}]*?)\bUser\b([^}]*?)}\s*from\s*['"]\.\.\/lib\/auth['"];?/,
      'import { AuthUser as User$1 } from \'../lib/auth\';'
    ).replace(
      /user:\s*User\s*\|/,
      'user: User |'
    );
    
    fs.writeFileSync(authContextPath, updatedAuthContextContent, 'utf8');
    console.log('✅ 已修改 AuthContext.tsx 文件中的 User 引用');
  }
  
  // 修復 Header.tsx 中的引用
  const headerPath = path.join(process.cwd(), 'app/components/Header.tsx');
  
  if (fs.existsSync(headerPath)) {
    let headerContent = fs.readFileSync(headerPath, 'utf8');
    
    // 更新 import
    const updatedHeaderContent = headerContent.replace(
      /import\s*{(?:[^}]*?)\bUser\b([^}]*?)}\s*from\s*['"]@\/app\/lib\/auth['"];?/,
      'import { AuthUser as User$1 } from \'@/app/lib/auth\';'
    );
    
    fs.writeFileSync(headerPath, updatedHeaderContent, 'utf8');
    console.log('✅ 已修改 Header.tsx 文件中的 User 引用');
  }
  
  // 恢復 user.d.ts 文件 (如果之前被備份了)
  const userDtsBakPath = path.join(process.cwd(), 'app/types/user.d.ts.bak');
  const userDtsPath = path.join(process.cwd(), 'app/types/user.d.ts');
  
  if (fs.existsSync(userDtsBakPath)) {
    // 讀取備份的內容
    let userDtsContent = fs.readFileSync(userDtsBakPath, 'utf8');
    
    // 更新引用
    const updatedUserDtsContent = userDtsContent.replace(
      /import\s*{\s*User\s+as\s+BaseUser\s*}\s*from\s*['"]@\/app\/lib\/auth['"];?/,
      'import { AuthUser as BaseUser } from \'@/app/lib/auth\';'
    ).replace(
      /declare\s+module\s+['"]@\/app\/lib\/auth['"]\s*{[^}]*?interface\s+User\s+extends\s+BaseUser[^}]*?}/s,
      'declare module \'@/app/lib/auth\' {\n  interface AuthUser extends BaseUser {\n    role: string;\n  }\n}'
    );
    
    // 寫入更新後的內容
    fs.writeFileSync(userDtsPath, updatedUserDtsContent, 'utf8');
    console.log('✅ 已恢復並修改 user.d.ts 文件');
    
    // 刪除備份文件
    fs.unlinkSync(userDtsBakPath);
  }
  
  // 清理緩存並嘗試構建
  try {
    // 移除 .next 目錄以清理構建緩存
    const nextDir = path.join(process.cwd(), '.next');
    if (fs.existsSync(nextDir)) {
      console.log('清理 .next 目錄...');
      fs.rmSync(nextDir, { recursive: true, force: true });
      console.log('✅ 已清理 .next 目錄');
    }
    
    console.log('修復完成。請嘗試重新構建項目。');
    
  } catch (error) {
    console.error('清理過程中發生錯誤:', error);
  }
}

// 執行主函數
fixUserTypeIssues().catch(console.error); 