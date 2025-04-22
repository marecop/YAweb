const fs = require('fs');
const path = require('path');

console.log('開始修復 AuthContext 類型問題...');

// 修復文件
function fixAuthContextFile() {
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
  
  // 確保 AuthContextType 接口中有 clearError 方法
  if (!content.includes('clearError: () => void')) {
    console.log('在 AuthContextType 中添加 clearError 方法');
    
    // 在接口中添加 clearError 方法
    content = content.replace(
      /export interface AuthContextType {[\s\S]*?}/,
      (match) => {
        if (!match.includes('clearError:')) {
          return match.replace(
            /}$/,
            '  clearError: () => void;\n}'
          );
        }
        return match;
      }
    );
  }
  
  // 確保 contextValue 中有 clearError
  if (!content.includes('clearError,') && !content.includes('clearError:')) {
    console.log('在 contextValue 中添加 clearError');
    
    content = content.replace(
      /const contextValue: AuthContextType = {[\s\S]*?};/,
      (match) => {
        if (!match.includes('clearError')) {
          return match.replace(
            /};$/,
            '  clearError,\n};'
          );
        }
        return match;
      }
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

// 修復登入頁面
function fixLoginPage() {
  const loginPagePath = path.join(process.cwd(), 'app/auth/login/page.tsx');
  const authContextPath = path.join(process.cwd(), 'app/contexts/AuthContext.tsx');
  
  // 檢查文件是否存在
  if (!fs.existsSync(loginPagePath) || !fs.existsSync(authContextPath)) {
    console.error('找不到必要的文件');
    return false;
  }
  
  console.log('正在讀取相關文件...');
  
  // 讀取 AuthContext 檢查是否有 clearError
  const authContextContent = fs.readFileSync(authContextPath, 'utf8');
  const hasClearError = authContextContent.includes('clearError: () => void') || authContextContent.includes('clearError,');

  // 讀取登入頁面內容
  let content = fs.readFileSync(loginPagePath, 'utf8');
  const originalContent = content;
  
  // 處理 clearError
  if (content.includes('clearError }') || content.includes('clearError,')) {
    // 只有當 AuthContext 中沒有 clearError 時才移除它
    if (!hasClearError) {
      console.log('由於 AuthContext 中缺少 clearError，修改登入頁面中的 clearError 使用');
      
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
    } else {
      console.log('AuthContext 中存在 clearError，保留登入頁面中的 clearError 使用');
    }
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

// 修復類型聲明文件或複製類型定義
function ensureAuthContextTypeConsistency() {
  // 檢查是否有單獨的類型定義文件
  const typesPath = path.join(process.cwd(), 'app/types/auth.ts');
  const contextPath = path.join(process.cwd(), 'app/contexts/AuthContext.tsx');
  
  // 如果沒有類型文件但有上下文文件
  if (!fs.existsSync(typesPath) && fs.existsSync(contextPath)) {
    // 從上下文文件中提取 AuthContextType 定義
    const content = fs.readFileSync(contextPath, 'utf8');
    const typeMatch = content.match(/export interface AuthContextType {[\s\S]*?}/);
    
    if (typeMatch) {
      console.log('生成 app/types/auth.ts 文件，確保類型一致性');
      
      // 創建目錄（如果不存在）
      if (!fs.existsSync(path.dirname(typesPath))) {
        fs.mkdirSync(path.dirname(typesPath), { recursive: true });
      }
      
      // 創建類型文件
      const typeContent = `// 從 AuthContext.tsx 自動生成的類型定義
import { User } from '@/app/lib/auth';

${typeMatch[0]}

// 自動生成，請勿手動修改
`;
      
      fs.writeFileSync(typesPath, typeContent, 'utf8');
      return true;
    }
  }
  
  return false;
}

// 執行修復
let fixedCount = 0;

if (fixAuthContextFile()) {
  fixedCount++;
}

if (fixLoginPage()) {
  fixedCount++;
}

if (ensureAuthContextTypeConsistency()) {
  fixedCount++;
}

console.log(`修復完成，共修復了 ${fixedCount} 個文件。`); 