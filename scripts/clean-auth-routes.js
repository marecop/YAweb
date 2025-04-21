const fs = require('fs');
const path = require('path');

console.log('🧹 開始清理認證路由文件...');

// 需要檢查的文件列表
const filesToCheck = [
  'app/api/auth/login/route.ts',
  'app/api/auth/route.ts',
  'app/api/auth/register/route.ts'
];

// 要被替換的模式
const replacements = [
  {
    pattern: /import\s*{\s*[^}]*createSession[^}]*}\s*from\s*['"]@\/app\/lib\/db['"]/g,
    replacement: '// MongoDB模型已導入，不需要從db.ts導入createSession'
  },
  {
    pattern: /import\s*{\s*[^}]*getSession[^}]*}\s*from\s*['"]@\/app\/lib\/db['"]/g,
    replacement: '// MongoDB模型已導入，不需要從db.ts導入getSession'
  },
  {
    pattern: /import\s*{\s*[^}]*deleteSession[^}]*}\s*from\s*['"]@\/app\/lib\/db['"]/g,
    replacement: '// MongoDB模型已導入，不需要從db.ts導入deleteSession'
  },
  {
    pattern: /import\s*{([^}]*)}\s*from\s*['"]@\/app\/lib\/db['"]/g,
    replacement: (match, importItems) => {
      // 移除createSession、getSession和deleteSession
      const cleanedImports = importItems
        .split(',')
        .map(item => item.trim())
        .filter(item => !['createSession', 'getSession', 'deleteSession'].includes(item))
        .join(', ');
      
      if (cleanedImports.trim()) {
        return `import { ${cleanedImports} } from '@/app/lib/db'`;
      } else {
        return '// 所有db.ts導入已被移除';
      }
    }
  }
];

let totalFixed = 0;

// 處理文件
filesToCheck.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  // 檢查文件是否存在
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️ 文件不存在: ${filePath}`);
    return;
  }
  
  // 讀取文件內容
  let content = fs.readFileSync(fullPath, 'utf8');
  let originalContent = content;
  
  // 應用替換
  replacements.forEach(({ pattern, replacement }) => {
    content = content.replace(pattern, replacement);
  });
  
  // 如果有變化，則寫回文件
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ 已修復導入問題: ${filePath}`);
    totalFixed++;
  } else {
    console.log(`ℹ️ 沒有發現問題: ${filePath}`);
  }
});

// 為了確保在沒有問題的情況下也通過
if (totalFixed === 0) {
  // 添加一個標記文件表示我們已經檢查過
  const markerPath = path.join(process.cwd(), 'scripts', '.auth-routes-checked');
  fs.writeFileSync(markerPath, new Date().toISOString(), 'utf8');
  console.log('✅ 創建檢查標記文件');
}

console.log(`🎉 完成清理! 修復了 ${totalFixed} 個文件的導入問題。`); 