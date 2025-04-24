const fs = require('fs');
const path = require('path');

// 修復 admin/layout.tsx 中的 AuthContext 問題
function fixAdminContext() {
  try {
    console.log('開始修復 admin/layout.tsx 和 AuthContext 的關係...');
    
    // 1. 首先檢查 AuthContext 是否包含 isLoading 屬性
    const authContextPath = path.join(process.cwd(), 'app/contexts/AuthContext.tsx');
    const adminLayoutPath = path.join(process.cwd(), 'app/admin/layout.tsx');
    
    if (!fs.existsSync(authContextPath)) {
      console.error('找不到 AuthContext.tsx 文件');
      return;
    }
    
    if (!fs.existsSync(adminLayoutPath)) {
      console.error('找不到 admin/layout.tsx 文件');
      return;
    }
    
    let authContextContent = fs.readFileSync(authContextPath, 'utf8');
    
    // 2. 確保 AuthContextType 接口中包含 isLoading 屬性
    if (!authContextContent.includes('isLoading: boolean;')) {
      console.log('需要在 AuthContextType 中添加 isLoading 屬性...');
      
      authContextContent = authContextContent.replace(
        /export\s+interface\s+AuthContextType\s*\{([^}]*)\}/,
        (match, content) => {
          if (!content.includes('isLoading:')) {
            return `export interface AuthContextType {${content}  isLoading: boolean;\n}`;
          }
          return match;
        }
      );
      
      // 保存修改後的 AuthContext 文件
      fs.writeFileSync(authContextPath, authContextContent);
      console.log('✅ AuthContextType 已更新，添加了 isLoading 屬性');
    } else {
      console.log('✓ AuthContextType 已包含 isLoading 屬性');
    }
    
    // 3. 修改 admin/layout.tsx 文件，確保引用正確
    const adminContent = fs.readFileSync(adminLayoutPath, 'utf8');
    
    // 修改引用為絕對路徑
    const updatedAdminContent = adminContent.replace(
      /import\s*{\s*useAuth\s*}\s*from\s*['"][^'"]*['"]/,
      "import { useAuth } from '@/app/contexts/AuthContext'"
    );
    
    if (updatedAdminContent !== adminContent) {
      fs.writeFileSync(adminLayoutPath, updatedAdminContent);
      console.log('✅ admin/layout.tsx 中的 AuthContext 引用已修復');
    } else {
      console.log('✓ admin/layout.tsx 中的 AuthContext 引用已正確');
    }
    
    console.log('完成修復！');
  } catch (error) {
    console.error('修復過程中發生錯誤:', error);
  }
}

// 執行修復
fixAdminContext(); 