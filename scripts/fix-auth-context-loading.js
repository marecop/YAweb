#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const authContextPath = path.join(process.cwd(), 'app', 'contexts', 'AuthContext.tsx');

console.log('開始修復 AuthContext 中的 setLoading/setIsLoading 變數問題...');

// 確認檔案存在
if (!fs.existsSync(authContextPath)) {
  console.error(`❌ 找不到 AuthContext 檔案: ${authContextPath}`);
  process.exit(1);
}

// 讀取檔案內容
let content = fs.readFileSync(authContextPath, 'utf8');

// 檢查變數定義
if (content.includes('const [loading, setIsLoading] = useState(true);')) {
  console.log('✅ 發現變數定義為 [loading, setIsLoading]');
  
  // 檢查是否有不一致的使用
  const occurrences = (content.match(/setLoading\(/g) || []).length;
  
  if (occurrences > 0) {
    console.log(`⚠️ 發現 ${occurrences} 處 setLoading() 的使用，應改為 setIsLoading()`);
    
    // 替換所有 setLoading( 為 setIsLoading(
    content = content.replace(/setLoading\(/g, 'setIsLoading(');
    
    // 寫回檔案
    fs.writeFileSync(authContextPath, content, 'utf8');
    console.log('✅ 已修正所有變數名稱不一致問題');
  } else {
    console.log('✅ 未發現 setLoading() 的錯誤使用');
  }
} else if (content.includes('const [loading, setLoading] = useState(true);')) {
  console.log('✅ 發現變數定義為 [loading, setLoading]，這是正確的命名，無需修改');
} else if (content.includes('const [isLoading, setIsLoading] = useState(true);')) {
  console.log('✅ 發現變數定義為 [isLoading, setIsLoading]');
  
  // 需要更改 loading 和 isLoading 保持一致
  content = content.replace('const [isLoading, setIsLoading] = useState(true);', 'const [loading, setLoading] = useState(true);');
  
  // 確保在其他地方也使用 loading
  content = content.replace(/isLoading/g, 'loading');
  
  // 寫回檔案
  fs.writeFileSync(authContextPath, content, 'utf8');
  console.log('✅ 已將所有 isLoading 變數改為 loading');
} else {
  console.log('⚠️ 未發現預期的變數定義模式，請手動檢查檔案');
}

console.log('AuthContext 變數修復完成！'); 