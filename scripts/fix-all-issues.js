#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 修復 AuthContext 中的 setLoading/setIsLoading 變數問題
function fixAuthContextLoading() {
  console.log('開始修復 AuthContext 中的 setLoading/setIsLoading 變數問題...');
  
  const authContextPath = path.join(process.cwd(), 'app', 'contexts', 'AuthContext.tsx');
  
  if (!fs.existsSync(authContextPath)) {
    console.error(`❌ 找不到 AuthContext 檔案: ${authContextPath}`);
    return;
  }
  
  let content = fs.readFileSync(authContextPath, 'utf8');
  
  // 檢查變數定義
  if (content.includes('const [loading, setIsLoading] = useState(true);')) {
    console.log('✅ 發現變數定義為 [loading, setIsLoading]');
    
    // 檢查是否有不一致的使用
    const occurrences = (content.match(/setLoading\(/g) || []).length;
    
    if (occurrences > 0) {
      console.log(`⚠️ 發現 ${occurrences} 處 setLoading() 的使用，修正為 setIsLoading()`);
      
      // 替換所有 setLoading( 為 setIsLoading(
      content = content.replace(/setLoading\(/g, 'setIsLoading(');
      
      // 寫回檔案
      fs.writeFileSync(authContextPath, content, 'utf8');
      console.log('✅ 已修正變數名稱不一致問題');
    }
  }
  
  // 添加 isLoggedIn 屬性
  if (!content.includes('isLoggedIn: boolean')) {
    console.log('⚠️ AuthContextType 中缺少 isLoggedIn 屬性，正在添加...');
    
    // 在 AuthContextType 介面中添加 isLoggedIn 屬性
    content = content.replace(
      'interface AuthContextType {',
      'interface AuthContextType {\n  isLoggedIn: boolean;'
    );
    
    // 在 value 對象中添加 isLoggedIn 屬性 (如果尚未添加)
    if (!content.includes('isLoggedIn: !!user')) {
      content = content.replace(
        'const value = {',
        'const value = {\n    isLoggedIn: !!user,'
      );
    }
    
    // 寫回檔案
    fs.writeFileSync(authContextPath, content, 'utf8');
    console.log('✅ 已添加 isLoggedIn 屬性');
  }
  
  console.log('AuthContext 修復完成！');
}

// 修復註冊頁面中的 isLoading 變數問題
function fixRegisterPageLoading() {
  console.log('開始修復註冊頁面中的 isLoading 變數問題...');
  
  const registerPagePath = path.join(process.cwd(), 'app', 'auth', 'register', 'page.tsx');
  
  if (!fs.existsSync(registerPagePath)) {
    console.error(`❌ 找不到註冊頁面: ${registerPagePath}`);
    return;
  }
  
  let content = fs.readFileSync(registerPagePath, 'utf8');
  
  // 檢查是否包含 isLoading 變數
  if (content.includes('const { register, isLoading }')) {
    console.log('✅ 找到 isLoading 變數，正在修改為 loading...');
    
    // 替換變數名稱
    content = content.replace(
      'const { register, isLoading } = useAuth();',
      'const { register, loading } = useAuth();'
    );
    
    // 寫回檔案
    fs.writeFileSync(registerPagePath, content, 'utf8');
    console.log('✅ 變數名稱已成功修改');
  } else if (content.includes('const { register, loading }')) {
    console.log('✅ 註冊頁面已使用正確的 loading 變數名稱');
  }
  
  console.log('註冊頁面修復完成！');
}

// 修復預訂頁面中的 Loading 變數問題
function fixBookingsPageLoading() {
  console.log('開始修復預訂頁面中的 Loading 變數問題...');
  
  const bookingsPagePath = path.join(process.cwd(), 'app', 'bookings', 'page.tsx');
  
  if (!fs.existsSync(bookingsPagePath)) {
    console.error(`❌ 找不到預訂頁面: ${bookingsPagePath}`);
    return;
  }
  
  let content = fs.readFileSync(bookingsPagePath, 'utf8');
  
  // 修正 Loading 解構變數名稱
  if (content.includes('const {isLoggedIn, user, Loading:')) {
    console.log('✅ 找到 Loading 別名，正在修改為 loading...');
    
    content = content.replace(
      /const {isLoggedIn, user, Loading: authloading} = useAuth\(\);/g,
      'const {isLoggedIn, user, loading: authLoading} = useAuth();'
    );
    
    // 修正在 useEffect 和 條件判斷中的用法
    content = content.replace(/authloading/g, 'authLoading');
    
    // 寫回檔案
    fs.writeFileSync(bookingsPagePath, content, 'utf8');
    console.log('✅ 變數名稱已成功修改');
  }
  
  console.log('預訂頁面修復完成！');
}

// 修復 Header.tsx 中的引用問題
function fixHeaderImports() {
  console.log('開始修復 Header.tsx 中的引用問題...');
  
  const headerPath = path.join(process.cwd(), 'app', 'components', 'Header.tsx');
  
  if (!fs.existsSync(headerPath)) {
    console.error(`❌ 找不到 Header.tsx 檔案: ${headerPath}`);
    return;
  }
  
  let content = fs.readFileSync(headerPath, 'utf8');
  
  // 修改 AuthUser as User 引用
  if (content.includes('import { AuthUser as User')) {
    console.log('⚠️ 發現 AuthUser as User 引用，正在修改...');
    
    content = content.replace(
      'import { AuthUser as User } from \'@/app/lib/auth\';',
      'import { User } from \'@/app/lib/auth\';'
    );
    
    // 寫回檔案
    fs.writeFileSync(headerPath, content, 'utf8');
    console.log('✅ 已修正引用問題');
  }
  
  console.log('Header.tsx 修復完成！');
}

// 創建 User 類型定義文件
function createUserType() {
  console.log('開始創建 User 類型定義...');
  
  const typesDir = path.join(process.cwd(), 'app', 'types');
  const typesPath = path.join(typesDir, 'index.ts');
  
  // 確保目錄存在
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
    console.log(`✅ 已創建目錄: ${typesDir}`);
  }
  
  // 檢查文件是否已存在
  if (!fs.existsSync(typesPath)) {
    const userTypeContent = `// 用戶基礎類型定義
export type User = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  memberLevel?: number;
  isMember?: boolean;
  password: string;
  totalMiles?: number;
  createdAt?: string;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  country?: string;
  city?: string;
  postalCode?: string;
};

// 其他共享類型可以在這裡添加
`;

    fs.writeFileSync(typesPath, userTypeContent, 'utf8');
    console.log(`✅ 已創建類型定義文件: ${typesPath}`);
  } else {
    console.log(`ℹ️ 類型定義文件已存在: ${typesPath}`);
  }
  
  console.log('User 類型創建完成！');
}

// 執行所有修復
function fixAllIssues() {
  console.log('開始修復所有問題...');
  
  createUserType();
  fixAuthContextLoading();
  fixRegisterPageLoading();
  fixBookingsPageLoading();
  fixHeaderImports();
  
  console.log('所有問題修復完成！');
}

// 執行修復
fixAllIssues(); 