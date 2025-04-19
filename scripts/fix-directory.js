const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 開始修復目錄結構...');

try {
  // 刪除所有帶空格的目錄
  console.log('🗑️ 移除有問題的目錄...');
  const appDir = path.join(__dirname, '../app');
  
  const dirs = fs.readdirSync(appDir);
  
  dirs.forEach(dir => {
    if (dir.includes(' ')) {
      const fullPath = path.join(appDir, dir);
      console.log(`   刪除: ${dir}`);
      fs.rmSync(fullPath, { recursive: true, force: true });
    }
  });
  
  console.log('✅ 目錄清理完成');
  
  // 修改 app/admin 目錄中的導入路徑
  console.log('🔄 更新模組路徑引用...');
  
  // 使用 git 檢查所有 .ts 和 .tsx 文件
  const tsFiles = execSync('git ls-files -- "*.ts" "*.tsx"', { encoding: 'utf8' })
    .split('\n')
    .filter(file => file.length > 0);
  
  let fixedFiles = 0;
  
  tsFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    try {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // 修正路徑引用
        content = content.replace(/@\/app\/admin\/components\/AdminLayout/g, '../components/AdminLayout');
        content = content.replace(/@\/app\/utils\/memberUtils/g, '../../utils/memberUtils');
        content = content.replace(/@\/app\/components\/AdminSidebar/g, '../components/AdminSidebar');
        content = content.replace(/@\/app\/contexts\/AuthContext/g, '../contexts/AuthContext');
        
        // 更多修正可以添加在這裡
        
        if (content !== originalContent) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`   更新: ${file}`);
          fixedFiles++;
        }
      }
    } catch (err) {
      console.error(`   錯誤處理文件 ${file}: ${err.message}`);
    }
  });
  
  console.log(`✅ 完成 ${fixedFiles} 個文件的路徑更新`);
  
  console.log('🧹 清理部署緩存...');
  try {
    if (fs.existsSync(path.join(__dirname, '../.next'))) {
      fs.rmSync(path.join(__dirname, '../.next'), { recursive: true, force: true });
      console.log('   已刪除 .next 目錄');
    }
  } catch (err) {
    console.error(`   清理緩存時出錯: ${err.message}`);
  }
  
  console.log('✅ 修復完成！');
} catch (error) {
  console.error('❌ 修復過程中出錯:', error);
  process.exit(1);
} 