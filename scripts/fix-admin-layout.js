const fs = require('fs');
const path = require('path');

// 主函數
async function fixAdminLayout() {
  console.log('開始修復 admin/layout.tsx 中的 loading 屬性問題...');
  
  // 檢查 admin/layout.tsx 文件
  const adminLayoutPath = path.join(process.cwd(), 'app/admin/layout.tsx');
  
  if (!fs.existsSync(adminLayoutPath)) {
    console.error('無法找到 app/admin/layout.tsx 文件');
    return;
  }
  
  // 讀取文件內容
  let adminLayoutContent = fs.readFileSync(adminLayoutPath, 'utf8');
  
  // 檢查 AuthContext.tsx 文件中正確的屬性名稱
  const authContextPath = path.join(process.cwd(), 'app/contexts/AuthContext.tsx');
  
  if (!fs.existsSync(authContextPath)) {
    console.error('無法找到 app/contexts/AuthContext.tsx 文件');
    return;
  }
  
  let authContextContent = fs.readFileSync(authContextPath, 'utf8');
  
  // 檢查 AuthContextType 介面中定義的屬性名稱
  const loadingPropertyName = authContextContent.includes('loading: boolean') ? 'loading' : 'isLoading';
  
  console.log(`在 AuthContextType 介面中定義的屬性名稱為: ${loadingPropertyName}`);
  
  // 修改 AdminLayout 中使用屬性的方式
  if (adminLayoutContent.includes('auth.isLoading')) {
    adminLayoutContent = adminLayoutContent.replace(
      /const\s+isLoading\s*=\s*auth\.isLoading/g,
      `const isLoading = auth.${loadingPropertyName}`
    );
    
    // 保存修改後的文件
    fs.writeFileSync(adminLayoutPath, adminLayoutContent, 'utf8');
    console.log(`✅ 已修改 admin/layout.tsx 中的屬性引用為 auth.${loadingPropertyName}`);
  } else {
    console.log('⚠️ 未找到需要修改的屬性引用');
  }
  
  // 直接替換 AuthContextType 接口定義，確保一致性
  console.log('替換 AuthContextType 接口定義以確保一致性...');
  
  const updatedAuthContextContent = authContextContent.replace(
    /export\s+interface\s+AuthContextType\s*{[^}]*?loading\s*:\s*boolean[^}]*?}/s,
    `export interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  user: AuthUser | null;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateUser: () => Promise<boolean>;
  getToken: () => Promise<string | null>;
  clearError: () => void;
}`
  ).replace(
    /export\s+interface\s+AuthContextType\s*{[^}]*?isLoading\s*:\s*boolean[^}]*?}/s,
    `export interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  user: AuthUser | null;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateUser: () => Promise<boolean>;
  getToken: () => Promise<string | null>;
  clearError: () => void;
}`
  );
  
  // 同時修改 value 對象
  const updatedValueContent = updatedAuthContextContent.replace(
    /const\s+value\s*(?::\s*AuthContextType)?\s*=\s*{([^}]*)isLoading([^}]*)}/s,
    (match, before, after) => {
      return `const value: AuthContextType = {${before}loading: isLoading${after}}`;
    }
  );
  
  // 保存修改後的 AuthContext.tsx 文件
  fs.writeFileSync(authContextPath, updatedValueContent, 'utf8');
  console.log('✅ 已更新 AuthContext.tsx 文件中的介面和值定義');
  
  // 現在處理所有使用 auth.isLoading 或 { isLoading } 的文件
  console.log('處理其他可能使用 isLoading 的文件...');
  
  const filesToCheck = [
    'app/bookings/page.tsx',
    'app/bookings/[bookingId]/page.tsx',
    'app/components/Header.tsx',
    'app/member/page.tsx',
    'app/auth/login/page.tsx',
    'app/auth/register/page.tsx'
  ];
  
  let fixedCount = 0;
  
  for (const filePath of filesToCheck) {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) continue;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    
    // 修復解構方式的引用
    if (content.includes('{ isLoggedIn, user, isLoading')) {
      content = content.replace(
        /{\s*([^}]*?)isLoggedIn([^}]*?)user([^}]*?)isLoading([^}]*?)}/g,
        '{ $1isLoggedIn$2user$3loading$4}'
      );
      modified = true;
    }
    
    // 修復 auth.isLoading 的引用
    if (content.includes('auth.isLoading')) {
      content = content.replace(/auth\.isLoading/g, 'auth.loading');
      modified = true;
    }
    
    // 修復其他使用 isLoading 變數的地方
    if (content.includes('isLoading:')) {
      content = content.replace(/isLoading:\s*authLoading/g, 'loading: authLoading');
      content = content.replace(/isLoading:\s*loading/g, 'loading');
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ 已修復文件: ${filePath}`);
      fixedCount++;
    }
  }
  
  console.log(`處理完成，共修復了 ${fixedCount} 個文件。`);
  
  // 清理緩存
  try {
    // 移除 .next 目錄以清理構建緩存
    const nextDir = path.join(process.cwd(), '.next');
    if (fs.existsSync(nextDir)) {
      console.log('清理 .next 目錄...');
      fs.rmSync(nextDir, { recursive: true, force: true });
      console.log('✅ 已清理 .next 目錄');
    }
    
    console.log('修復完成。請嘗試重新構建項目。');
    
  } catch (error) {
    console.error('清理過程中發生錯誤:', error);
  }
}

// 執行主函數
fixAdminLayout().catch(console.error); 