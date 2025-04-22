const fs = require('fs');
const path = require('path');

console.log('開始修復 isLoading: isLoading: 錯誤...');

const targetFiles = [
  'app/auth/login/page.tsx',
  'app/auth/register/page.tsx'
];

// 遍歷目標文件
let fixedCount = 0;
targetFiles.forEach(filePath => {
  const absolutePath = path.join(process.cwd(), filePath);
  
  // 檢查文件是否存在
  if (!fs.existsSync(absolutePath)) {
    console.log(`文件不存在: ${filePath}`);
    return;
  }
  
  // 讀取文件內容
  let content = fs.readFileSync(absolutePath, 'utf8');
  
  // 檢查並修復 isLoading: isLoading: loading 錯誤
  if (content.includes('isLoading: isLoading:')) {
    console.log(`在 ${filePath} 中發現並修復錯誤`);
    
    // 替換錯誤
    const fixedContent = content.replace(/isLoading: isLoading:/g, 'isLoading:');
    
    // 寫回文件
    fs.writeFileSync(absolutePath, fixedContent, 'utf8');
    fixedCount++;
  } else {
    console.log(`檢查 ${filePath} - 未發現錯誤`);
  }
});

console.log(`修復完成! 已修復 ${fixedCount} 個文件。`);

// 檢查所有 .tsx 和 .ts 文件
console.log('開始在整個專案中搜尋可能的錯誤...');

function findAndFixFilesInDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const res = path.resolve(dir, file.name);
    
    if (file.isDirectory()) {
      // 跳過 node_modules 和 .next 目錄
      if (file.name !== 'node_modules' && file.name !== '.next') {
        findAndFixFilesInDir(res);
      }
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      // 讀取文件內容
      let content = fs.readFileSync(res, 'utf8');
      
      // 檢查並修復 isLoading: isLoading: loading 錯誤
      if (content.includes('isLoading: isLoading:')) {
        console.log(`在 ${res} 中發現並修復錯誤`);
        
        // 替換錯誤
        const fixedContent = content.replace(/isLoading: isLoading:/g, 'isLoading:');
        
        // 寫回文件
        fs.writeFileSync(res, fixedContent, 'utf8');
        fixedCount++;
      }
    }
  }
}

findAndFixFilesInDir(path.join(process.cwd(), 'app'));

console.log(`全部修復完成! 總共修復 ${fixedCount} 個文件。`); 