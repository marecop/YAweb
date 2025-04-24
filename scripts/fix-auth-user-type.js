#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const authFilePath = path.join(process.cwd(), 'app', 'lib', 'auth.ts');
const userTypePath = path.join(process.cwd(), 'app', 'types', 'user.d.ts');

console.log('開始修復 User 類型的循環引用問題...');

// 確認 auth.ts 檔案存在
if (!fs.existsSync(authFilePath)) {
  console.error(`❌ 找不到 auth.ts 檔案: ${authFilePath}`);
  process.exit(1);
}

// 讀取 auth.ts 檔案內容
let authContent = fs.readFileSync(authFilePath, 'utf8');

// 提取 AuthUser 類型定義
let authUserDefinition = null;
const authUserMatch = authContent.match(/export\s+type\s+AuthUser\s+=\s+\{[\s\S]+?\};/);

if (authUserMatch) {
  authUserDefinition = authUserMatch[0];
  console.log('✅ 找到 AuthUser 類型定義');

  // 將 AuthUser 類型定義移到一個基礎類型文件
  const baseTypesPath = path.join(process.cwd(), 'app', 'types', 'index.ts');
  
  // 確保目錄存在
  if (!fs.existsSync(path.join(process.cwd(), 'app', 'types'))) {
    fs.mkdirSync(path.join(process.cwd(), 'app', 'types'), { recursive: true });
  }
  
  // 重新定義 User 類型
  const baseTypes = `// 用戶基礎類型定義
${authUserDefinition.replace('export type AuthUser', 'export type User')}

// 其他共享類型可以在這裡添加
`;

  fs.writeFileSync(baseTypesPath, baseTypes);
  console.log(`✅ 已創建基礎類型文件: ${baseTypesPath}`);

  // 更新 auth.ts 文件
  authContent = authContent.replace(authUserMatch[0], `// 引入用戶類型
import type { User } from '../types';

// 導出 User 類型以便其他文件使用
export type { User };`);

  // 替換 auth.ts 文件中所有 AuthUser 為 User
  authContent = authContent.replace(/\bAuthUser\b(?!\s*=)/g, 'User');

  fs.writeFileSync(authFilePath, authContent);
  console.log('✅ 已更新 auth.ts 文件');

  // 修改 user.d.ts 文件（如果存在）
  if (fs.existsSync(userTypePath)) {
    console.log('✅ 找到 user.d.ts 文件，正在更新...');
    const userTypeContent = fs.readFileSync(userTypePath, 'utf8');
    
    // 移除循環引用
    const updatedUserTypeContent = `// 用戶類型擴展
import type { User } from '../types';

// 擴展 User 類型 (如果需要)
declare module '../types' {
  interface User {
    // 這裡可以添加其他屬性
  }
}
`;

    fs.writeFileSync(userTypePath, updatedUserTypeContent);
    console.log('✅ 已更新 user.d.ts 文件');
  }

} else {
  console.log('⚠️ 未找到 AuthUser 類型定義，可能已經修復');
}

console.log('類型循環引用修復完成！'); 