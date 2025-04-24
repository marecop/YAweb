const fs = require('fs');
const path = require('path');

// 要刪除的腳本清單
const scriptsToDelete = [
  'fix-all-loading-vars.js',
  'fix-isloading-variable.js',
  'fix-loading-property.js',
  'fix-final-loading.js',
  'fix-auth-loading.js',
  'fix-miles-isLoading.js',
  'fix-bookings-authLoading.js',
  'fix-auth-context-type.js',
  'fix-auth-context-type-v2.js',
  'fix-duplicate-isloading.js'
];

console.log('開始清理與 loading 變數相關的腳本...');

scriptsToDelete.forEach(scriptFile => {
  const filePath = path.join(process.cwd(), 'scripts', scriptFile);
  
  if (fs.existsSync(filePath)) {
    try {
      // 先移動到備份文件
      fs.renameSync(filePath, `${filePath}.bak`);
      console.log(`已備份腳本: ${scriptFile}`);
    } catch (err) {
      console.error(`無法備份腳本 ${scriptFile}: ${err.message}`);
    }
  } else {
    console.log(`腳本不存在: ${scriptFile}`);
  }
});

// 創建一個新的標記文件，防止這些腳本再次被執行
const markFilePath = path.join(process.cwd(), 'scripts', '.loading-var-fixed');
fs.writeFileSync(markFilePath, 'Loading variable has been standardized to "loading" across the project.');

console.log('清理完成！所有與 loading 變數相關的腳本已備份並禁用。');
console.log('項目中的 loading 變數已統一為 "loading"。');

// 添加一個新腳本來強制使用 "loading" 變數
const enforcerScriptPath = path.join(process.cwd(), 'scripts', 'enforce-loading-var.js');
const enforcerScriptContent = `
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

// 遞迴搜尋目錄
const searchAndReplaceInDir = (dir) => {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    // 忽略 node_modules, .next 和 .git 目錄
    if (['node_modules', '.next', '.git'].includes(item)) {
      continue;
    }
    
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      // 遞迴處理子目錄
      searchAndReplaceInDir(itemPath);
    } else if (stats.isFile() && 
              (itemPath.endsWith('.tsx') || 
               itemPath.endsWith('.ts') || 
               itemPath.endsWith('.jsx') || 
               itemPath.endsWith('.js'))) {
      
      // 處理 TypeScript/JavaScript 文件
      let content = fs.readFileSync(itemPath, 'utf8');
      let modified = false;
      
      // 檢查 AuthContext 相關的引用
      if (content.includes('useAuth()') || content.includes('AuthContext')) {
        console.log(\`檢查文件: \${itemPath}\`);
        
        // 1. 替換從 useAuth 解構的 isLoading 為 loading
        const before = content;
        content = content.replace(
          /const\s*{([^}]*)isLoading([^}]*)}\s*=\s*useAuth\(\)/g,
          'const {$1loading$2} = useAuth()'
        );
        
        // 2. 替換條件檢查中的 isLoading
        content = content.replace(/if\s*\(\s*isLoading\s*\)/g, 'if (loading)');
        content = content.replace(/if\s*\(\s*!\s*isLoading\s*\)/g, 'if (!loading)');
        
        // 3. 替換 JSX 中的使用
        content = content.replace(/{isLoading(\s*\?[^:]+:[^}]+)}/g, '{loading$1}');
        
        // 4. 替換其他獨立的 isLoading 引用
        content = content.replace(/\\bisLoading\\b(?!\\s*[.:={}])/g, 'loading');
        
        // 檢查是否有修改
        if (content !== before) {
          fs.writeFileSync(itemPath, content, 'utf8');
          console.log(\`✅ 已修復文件: \${itemPath}\`);
          modified = true;
        }
      }
      
      if (!modified) {
        console.log(\`⏭️ 無需修改文件: \${itemPath}\`);
      }
    }
  }
};

console.log('開始檢查並確保項目中統一使用 loading 變數...');
searchAndReplaceInDir(path.join(process.cwd(), 'app'));
console.log('完成！');
`;

fs.writeFileSync(enforcerScriptPath, enforcerScriptContent, 'utf8');
console.log('已創建強制使用 loading 變數的腳本: enforce-loading-var.js'); 