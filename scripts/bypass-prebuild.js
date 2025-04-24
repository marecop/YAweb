const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('開始繞過 prebuild 腳本...');

// 1. 備份 package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJsonBackupPath = path.join(process.cwd(), 'package.json.backup');

if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ 找不到 package.json 文件');
  process.exit(1);
}

// 創建備份
fs.copyFileSync(packageJsonPath, packageJsonBackupPath);
console.log('✅ 已創建 package.json 備份');

// 2. 讀取並修改 package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 保存原始 prebuild 腳本
const originalPrebuild = packageJson.scripts.prebuild;

// 臨時替換為空腳本
packageJson.scripts.prebuild = 'echo "跳過 prebuild 腳本"';

// 保存修改
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✅ 已臨時禁用 prebuild 腳本');

// 3. 執行構建
console.log('開始執行 next build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ 構建成功完成');
} catch (error) {
  console.error('❌ 構建過程中發生錯誤:', error.message);
} finally {
  // 4. 恢復原始 package.json
  fs.copyFileSync(packageJsonBackupPath, packageJsonPath);
  console.log('✅ 已恢復原始 package.json');
  
  // 5. 刪除備份
  fs.unlinkSync(packageJsonBackupPath);
  console.log('✅ 已刪除備份文件');
} 