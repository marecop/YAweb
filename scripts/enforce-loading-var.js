/**
 * 此腳本用於確保項目中統一使用 loading 變數
 */
const fs = require('fs');
const path = require('path');

// 標記文件檢查
const markFilePath = path.join(process.cwd(), 'scripts', '.loading-var-fixed');
if (!fs.existsSync(markFilePath)) {
  console.log('此腳本只應在初始修復後運行。如需重新運行，請刪除 .loading-var-fixed 標記文件。');
  process.exit(0);
}

// 要處理的目錄
const directories = ['app'];

// 要忽略的目錄
const ignoreDirs = ['node_modules', '.next', '.git', 'public', 'scripts'];

// 要處理的文件類型
const fileExtensions = ['.tsx', '.ts', '.jsx', '.js'];

// 記錄修改的文件
const modifiedFiles = [];

// 遞歸處理目錄
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    // 如果是目錄且不在忽略列表中，則遞歸處理
    if (stat.isDirectory()) {
      if (!ignoreDirs.includes(file)) {
        processDirectory(fullPath);
      }
      continue;
    }
    
    // 檢查文件擴展名
    const ext = path.extname(file);
    if (!fileExtensions.includes(ext)) {
      continue;
    }
    
    // 讀取文件內容
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    
    // 檢查是否是 AuthContext.tsx 文件（需要特殊處理）
    if (fullPath.includes('AuthContext.tsx')) {
      // 在 AuthContext.tsx 中更新類型定義和狀態變量
      content = content.replace(/isLoading: boolean/g, 'loading: boolean');
      content = content.replace(/isLoading: isLoading/g, 'loading: loading');
      content = content.replace(/isLoading: false/g, 'loading: false');
      content = content.replace(/isLoading: true/g, 'loading: true');
      content = content.replace(/isLoading,/g, 'loading,');
      content = content.replace(/setIsLoading\(/g, 'setLoading(');
      content = content.replace(/const \[isLoading, setIsLoading\]/g, 'const [loading, setLoading]');
    } else {
      // 其他文件中替換使用
      content = content.replace(/isLoading\}/g, 'loading}');
      content = content.replace(/isLoading,/g, 'loading,');
      content = content.replace(/isLoading\)/g, 'loading)');
      content = content.replace(/isLoading\s*&&/g, 'loading &&');
      content = content.replace(/{\s*isLoading\s*\?/g, '{ loading ?');
      content = content.replace(/if\s*\(\s*isLoading\s*\)/g, 'if (loading)');
      content = content.replace(/\[isLoading/g, '[loading');
      content = content.replace(/isLoading\]/g, 'loading]');
      content = content.replace(/isLoading:/g, 'loading:');
    }
    
    // 如果內容有變化，則寫回文件
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content);
      modifiedFiles.push(fullPath);
      console.log(`已修改文件: ${fullPath}`);
    }
  }
}

// 開始處理
console.log('開始修復 isLoading 變數問題...');

for (const dir of directories) {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    processDirectory(dirPath);
  }
}

console.log(`共修改了 ${modifiedFiles.length} 個文件:`);
modifiedFiles.forEach(file => console.log(`- ${file}`));
console.log('修復完成！');
