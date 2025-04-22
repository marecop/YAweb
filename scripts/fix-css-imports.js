/**
 * 此腳本用於修復CSS模組引用路徑問題
 */

const fs = require('fs');
const path = require('path');

console.log('開始修復CSS模組引用問題...');

// 修復註冊頁面中的CSS引用
function fixRegisterPage() {
  const registerPagePath = path.join(process.cwd(), 'app/auth/register/page.tsx');
  
  if (!fs.existsSync(registerPagePath)) {
    console.log('找不到註冊頁面文件');
    return false;
  }
  
  console.log('正在修復註冊頁面的CSS引用...');
  let content = fs.readFileSync(registerPagePath, 'utf8');
  let modified = false;
  
  // 檢查並修改CSS導入路徑
  if (content.includes("import styles from '../login/login.module.css'")) {
    console.log('註冊頁面的CSS導入路徑看起來是正確的，但確保該文件存在');
    
    // 檢查 login.module.css 文件是否存在
    const loginCssPath = path.join(process.cwd(), 'app/auth/login/login.module.css');
    if (!fs.existsSync(loginCssPath)) {
      console.log('未找到 login.module.css 文件，正在創建...');
      
      // CSS 內容
      const cssContent = `/* 登入和註冊頁面樣式 */

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f9fafb;
}

.loginCard {
  width: 100%;
  max-width: 450px;
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  margin-bottom: 1.5rem;
  font-size: 1.875rem;
  font-weight: 700;
  text-align: center;
  color: #1f2937;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.formGroup {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.formGroup label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}

.button {
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: #f59e0b;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: #d97706;
}

.button:disabled {
  background-color: #f59e0b;
  opacity: 0.7;
  cursor: not-allowed;
}

.links {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.links a {
  color: #f59e0b;
  font-weight: 500;
  text-decoration: none;
}

.links a:hover {
  text-decoration: underline;
}

.error {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  color: #b91c1c;
  font-size: 0.875rem;
}`;
      
      // 確保目錄存在
      const loginDir = path.dirname(loginCssPath);
      if (!fs.existsSync(loginDir)) {
        fs.mkdirSync(loginDir, { recursive: true });
      }
      
      fs.writeFileSync(loginCssPath, cssContent, 'utf8');
      console.log('✅ 已創建 login.module.css 文件');
      modified = true;
    }
  } else {
    // 如果未使用CSS模組，更新為使用CSS模組
    const importRegex = /import\s+.*from\s+['"].*['"]/;
    const lastImport = content.match(new RegExp(importRegex.source + '.*$', 'm'));
    
    if (lastImport) {
      const importPosition = content.lastIndexOf(lastImport[0]) + lastImport[0].length;
      const newContent = content.slice(0, importPosition) + 
                        "\nimport styles from '../login/login.module.css';" + 
                        content.slice(importPosition);
      content = newContent;
      modified = true;
    }
    
    // 更新樣式類名引用
    content = content.replace(
      /className="[^"]*"/g, 
      match => {
        // 僅替換最基本的樣式屬性，更複雜的可能需要人工檢查
        return match.replace('className="', 'className={styles.');
      }
    );
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(registerPagePath, content, 'utf8');
    console.log('✅ 已修復註冊頁面');
    return true;
  } else {
    console.log('⚠️ 註冊頁面沒有發現需要修復的問題');
    return false;
  }
}

// 執行修復
let fixedFiles = 0;

if (fixRegisterPage()) fixedFiles++;

console.log(`修復完成，共修復了 ${fixedFiles} 個文件`); 