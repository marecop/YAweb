const fs = require('fs');
const path = require('path');

console.log('開始修復 User 類型中的 role 屬性...');

// 1. 檢查 User 類型定義
const authLibPath = path.join(process.cwd(), 'app/lib/auth.ts');
if (!fs.existsSync(authLibPath)) {
  console.error('❌ 找不到 auth.ts 文件');
  return;
}

let authLibContent = fs.readFileSync(authLibPath, 'utf8');

// 檢查 User 類型是否已包含 role 屬性
const userTypeMatch = authLibContent.match(/export\s+type\s+User\s*=\s*{[^}]*}/);
if (userTypeMatch) {
  const userTypeDefinition = userTypeMatch[0];
  
  // 如果類型定義中沒有 role，添加它
  if (!userTypeDefinition.includes('role:')) {
    console.log('需要添加 role 屬性到 User 類型...');
    
    const updatedUserType = userTypeDefinition.replace(
      /export\s+type\s+User\s*=\s*{/,
      'export type User = {\n  role: string;\n  '
    );
    
    // 更新完整文件內容
    authLibContent = authLibContent.replace(userTypeMatch[0], updatedUserType);
    fs.writeFileSync(authLibPath, authLibContent);
    console.log('✅ 已添加 role 屬性到 User 類型');
  } else {
    console.log('✓ User 類型已包含 role 屬性');
  }
} else {
  console.error('❌ 無法在 auth.ts 中找到 User 類型定義');
}

// 2. 直接執行 next build
try {
  console.log('執行 next build...');
  require('child_process').execSync('npx next build', { stdio: 'inherit' });
  console.log('✅ 構建成功完成');
} catch (error) {
  console.error('❌ 構建過程中發生錯誤:', error);
} 