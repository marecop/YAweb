const fs = require('fs');
const path = require('path');

// 修復AuthContext介面的isLoading屬性
function fixAuthContextTypes() {
  try {
    console.log('開始修復 AuthContextType 介面和文件引用...');
    
    // 1. 更新AuthContextType介面確保包含isLoading
    const authContextPath = path.join(process.cwd(), 'app/contexts/AuthContext.tsx');
    let authContextContent = fs.readFileSync(authContextPath, 'utf8');
    
    // 確保AuthContextType介面包含isLoading
    if (!authContextContent.includes('isLoading: boolean;')) {
      authContextContent = authContextContent.replace(
        /export interface AuthContextType {([^}]*)}/,
        (match, content) => {
          if (!content.includes('isLoading')) {
            return `export interface AuthContextType {${content}  isLoading: boolean;\n}`;
          }
          return match;
        }
      );
      
      fs.writeFileSync(authContextPath, authContextContent);
      console.log('✅ 已更新 AuthContextType 介面包含 isLoading 屬性');
    } else {
      console.log('ℹ️ AuthContextType 已包含 isLoading 屬性，無需修改');
    }
    
    // 2. 尋找並修復所有使用loading的地方
    const appDir = path.join(process.cwd(), 'app');
    fixDirectoryFiles(appDir);
    
    console.log('✅ 所有文件修復完成');
  } catch (error) {
    console.error('修復過程中發生錯誤:', error);
  }
}

// 遞迴處理目錄內的文件
function fixDirectoryFiles(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // 遞迴處理子目錄
      fixDirectoryFiles(filePath);
    } else if (stats.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts'))) {
      // 處理TypeScript文件
      fixUseAuthInFile(filePath);
    }
  }
}

// 修復文件中使用useAuth的部分
function fixUseAuthInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 檢查文件是否使用了AuthContext
    if (content.includes('useAuth')) {
      // 修復loading -> isLoading
      if (content.includes('loading') && content.includes('useAuth')) {
        const originalContent = content;
        
        // 修復解構中的loading -> isLoading (直接使用)
        content = content.replace(
          /const\s*{\s*([^}]*?)loading([^}]*?)\s*}\s*=\s*useAuth\(\)/g,
          'const {$1isLoading$2} = useAuth()'
        );
        
        // 修復解構中的loading -> isLoading (使用重命名)
        content = content.replace(
          /const\s*{\s*([^}]*?)loading\s*:\s*([a-zA-Z0-9]+)([^}]*?)\s*}\s*=\s*useAuth\(\)/g,
          'const {$1isLoading: $2$3} = useAuth()'
        );
        
        // 檢查文件是否已經被修改
        if (content !== originalContent) {
          fs.writeFileSync(filePath, content);
          console.log(`✅ 已修復文件: ${filePath}`);
          modified = true;
        }
      }
    }
    
    if (!modified && content.includes('useAuth') && content.includes('loading')) {
      console.log(`ℹ️ 檢查文件但不需要修改: ${filePath}`);
    }
  } catch (error) {
    console.error(`修復文件 ${filePath} 時發生錯誤:`, error);
  }
}

// 執行修復
fixAuthContextTypes(); 