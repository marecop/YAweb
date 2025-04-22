/**
 * 此腳本用於修復使用CSS模組語法的頁面，轉換為直接使用Tailwind類名
 */

const fs = require('fs');
const path = require('path');

console.log('開始修復Tailwind CSS語法問題...');

// 需要檢查的文件列表
const filesToCheck = [
  'app/auth/register/page.tsx',
  'app/auth/login/page.tsx',
  'app/member/page.tsx',
  'app/bookings/page.tsx'
];

// 檢查並修復文件
function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`找不到文件：${filePath}`);
    return false;
  }
  
  console.log(`正在檢查文件：${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // 1. 檢查並移除CSS模組導入
  const cssModuleImportRegex = /import\s+(\w+)\s+from\s+['"].*\.module\.css['"]/;
  const cssModuleImportMatch = content.match(cssModuleImportRegex);
  
  if (cssModuleImportMatch) {
    const stylesVar = cssModuleImportMatch[1]; // 通常是 'styles'
    console.log(`發現CSS模組導入: ${cssModuleImportMatch[0]}`);
    
    // 移除CSS模組導入語句
    content = content.replace(cssModuleImportRegex, '');
    
    // 2. 修復不正確的CSS模組類名語法
    // 使用正則表達式查找 className={styles.xxx"} 這種錯誤模式
    const brokenStyleRegex = new RegExp(`className=\\{${stylesVar}\\.([-\\w]+)\\s([^}]*)"\\}`, 'g');
    content = content.replace(brokenStyleRegex, (match, className, rest) => {
      return `className="${className} ${rest}"`;
    });
    
    // 3. 修復正確的CSS模組類名使用方式 className={styles.xxx}
    const stylesUsageRegex = new RegExp(`className=\\{${stylesVar}\\.([-\\w]+)\\}`, 'g');
    content = content.replace(stylesUsageRegex, (match, className) => {
      return `className="${className}"`;
    });
    
    // 4. 修復複雜的CSS模組引用, 例如 className={`${styles.xxx} ${styles.yyy}`}
    const complexStylesRegex = new RegExp(`className=\\{\\s*\`\\s*\\$\\{${stylesVar}\\.([-\\w]+)\\}\\s*\\$\\{${stylesVar}\\.([-\\w]+)\\}\\s*\`\\s*\\}`, 'g');
    content = content.replace(complexStylesRegex, (match, class1, class2) => {
      return `className="${class1} ${class2}"`;
    });
    
    modified = true;
  }
  
  // 5. 修復任何帶有CSS模組前綴但沒有正確關閉的類名
  // 例如 className={styles.xxx"
  const badClosingRegex = /className=\{styles\.([-\w]+)"/g;
  if (badClosingRegex.test(content)) {
    content = content.replace(badClosingRegex, (match, className) => {
      console.log(`修復不正確關閉的CSS類: ${match}`);
      return `className="${className}"`;
    });
    modified = true;
  }
  
  // 保存修改
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 已修復文件：${filePath}`);
    return true;
  } else {
    console.log(`⚠️ 文件 ${filePath} 沒有需要修復的問題`);
    return false;
  }
}

// 執行修復
let fixedFiles = 0;

filesToCheck.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fixFile(fullPath)) {
    fixedFiles++;
  }
});

console.log(`修復完成，共修復了 ${fixedFiles} 個文件`); 