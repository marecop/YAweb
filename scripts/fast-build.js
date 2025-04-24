const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('開始快速構建流程...');

// 1. 修復 admin/layout.tsx 的引用問題（僅在必要時）
const adminLayoutPath = path.join(process.cwd(), 'app/admin/layout.tsx');
if (fs.existsSync(adminLayoutPath)) {
  let content = fs.readFileSync(adminLayoutPath, 'utf8');
  
  // 確保使用絕對路徑引用 AuthContext
  if (!content.includes("from '@/app/contexts/AuthContext'")) {
    content = content.replace(
      /import\s*{\s*useAuth\s*}\s*from\s*['"][^'"]*['"]/,
      "import { useAuth } from '@/app/contexts/AuthContext'"
    );
    fs.writeFileSync(adminLayoutPath, content);
    console.log('✅ 已修復 admin/layout.tsx 的引用');
  }
}

// 2. 直接執行 next build 命令，跳過其他前置腳本
try {
  console.log('執行 next build...');
  execSync('npx next build', { stdio: 'inherit' });
  console.log('✅ 構建成功完成');
} catch (error) {
  console.error('❌ 構建過程中發生錯誤:', error);
} 