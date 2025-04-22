const fs = require('fs');
const path = require('path');

console.log('開始修復驗證上下文類型問題...');

// 首先檢查 AuthContext.tsx
const authContextPath = path.join(process.cwd(), 'app', 'contexts', 'AuthContext.tsx');

if (fs.existsSync(authContextPath)) {
  console.log('檢查 AuthContext.tsx...');
  let authContextContent = fs.readFileSync(authContextPath, 'utf8');
  
  // 檢查 AuthContextType 是否包含 clearError
  if (authContextContent.includes('export interface AuthContextType') && 
      !authContextContent.includes('clearError: () => void')) {
    console.log('在 AuthContextType 中添加 clearError 方法');
    authContextContent = authContextContent.replace(
      /export interface AuthContextType {[\s\S]*?}/,
      (match) => {
        return match.replace(
          /}$/,
          '  clearError: () => void;\n}'
        );
      }
    );
  }
  
  // 檢查 clearError 函數是否定義
  if (!authContextContent.includes('const clearError = () => {')) {
    console.log('添加 clearError 函數定義');
    authContextContent = authContextContent.replace(
      /export function AuthProvider\(\{ children \}: AuthProviderProps\) {/,
      'export function AuthProvider({ children }: AuthProviderProps) {\n  const [isLoggedIn, setIsLoggedIn] = useState(false);\n  const [user, setUser] = useState<User | null>(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n\n  // 清除錯誤信息\n  const clearError = () => {\n    setError(null);\n  };'
    );
  }
  
  // 檢查 contextValue 是否包含 clearError
  if (authContextContent.includes('const contextValue') && 
      !authContextContent.includes('clearError,') && 
      !authContextContent.includes('clearError:')) {
    console.log('在 contextValue 中添加 clearError');
    authContextContent = authContextContent.replace(
      /const contextValue[^;]*?{[\s\S]*?};/,
      (match) => {
        return match.replace(
          /};$/,
          '  clearError,\n};'
        );
      }
    );
  }
  
  // 將 AuthContextType 接口中的 loading 重命名為 isLoading
  if (authContextContent.includes('export interface AuthContextType') && 
      authContextContent.includes('loading: boolean;')) {
    authContextContent = authContextContent.replace(
      'loading: boolean;',
      'isLoading: boolean;'
    );
    
    // 更新其他所有的 loading 引用為 isLoading
    // 在 AuthProvider 組件中
    authContextContent = authContextContent.replace(
      'const [loading, setLoading] = useState(true);',
      'const [isLoading, setIsLoading] = useState(true);'
    );
    
    // 更新所有 setLoading 調用
    authContextContent = authContextContent.replace(/setLoading\(true\);/g, 'setIsLoading(true);');
    authContextContent = authContextContent.replace(/setLoading\(false\);/g, 'setIsLoading(false);');
    
    // 更新 contextValue 中的 loading 屬性
    authContextContent = authContextContent.replace(
      /loading,/g,
      'isLoading,');
      
    // 更新所有依賴項數組中的 loading
    authContextContent = authContextContent.replace(
      /\[isLoggedIn, user, loading, error\]/g,
      '[isLoggedIn, user, isLoading, error]'
    );
    
    fs.writeFileSync(authContextPath, authContextContent);
    console.log('已將 loading 重命名為 isLoading');
  } else if (authContextContent.includes('export interface AuthContextType') && 
             authContextContent.includes('isLoading: boolean;')) {
    console.log('AuthContextType 已經使用 isLoading 屬性');
  }
} else {
  console.log('找不到 AuthContext.tsx 檔案');
}

// 檢查 login 頁面
const loginPagePath = path.join(process.cwd(), 'app', 'auth', 'login', 'page.tsx');

if (fs.existsSync(loginPagePath)) {
  console.log('檢查 login/page.tsx...');
  let loginPageContent = fs.readFileSync(loginPagePath, 'utf8');
  
  // 修復可能的雙冒號問題
  if (loginPageContent.includes('isLoading: isLoading:')) {
    loginPageContent = loginPageContent.replace(
      /isLoading: isLoading:/g,
      'isLoading:'
    );
    console.log('修復了 login/page.tsx 中的雙冒號問題');
  }
  
  // 更新 loading 屬性引用
  if (loginPageContent.includes('loading,') && loginPageContent.includes('} = useAuth()')) {
    loginPageContent = loginPageContent.replace(
      /const \{([^}]*?)loading([^}]*?)\} = useAuth\(\);/,
      'const {$1isLoading: loading$2} = useAuth();'
    );
    
    fs.writeFileSync(loginPagePath, loginPageContent);
    console.log('已更新 login/page.tsx 中的 loading 屬性使用');
  }
} else {
  console.log('找不到 login/page.tsx 檔案');
}

// 檢查 register 頁面
const registerPagePath = path.join(process.cwd(), 'app', 'auth', 'register', 'page.tsx');

if (fs.existsSync(registerPagePath)) {
  console.log('檢查 register/page.tsx...');
  let registerPageContent = fs.readFileSync(registerPagePath, 'utf8');
  
  // 更新 loading 屬性引用
  if (registerPageContent.includes('loading,') && registerPageContent.includes('} = useAuth()')) {
    registerPageContent = registerPageContent.replace(
      /const \{([^}]*?)loading([^}]*?)\} = useAuth\(\);/,
      'const {$1isLoading: loading$2} = useAuth();'
    );
    
    fs.writeFileSync(registerPagePath, registerPageContent);
    console.log('已更新 register/page.tsx 中的 loading 屬性使用');
  }
} else {
  console.log('找不到 register/page.tsx 檔案');
}

// 檢查其他可能使用 loading 屬性的頁面
const memberPagePath = path.join(process.cwd(), 'app', 'member', 'page.tsx');
if (fs.existsSync(memberPagePath)) {
  console.log('檢查 member/page.tsx...');
  let memberPageContent = fs.readFileSync(memberPagePath, 'utf8');
  
  if (memberPageContent.includes('loading,') && memberPageContent.includes('} = useAuth()')) {
    memberPageContent = memberPageContent.replace(
      /const \{([^}]*?)loading([^}]*?)\} = useAuth\(\);/,
      'const {$1isLoading: loading$2} = useAuth();'
    );
    
    fs.writeFileSync(memberPagePath, memberPageContent);
    console.log('已更新 member/page.tsx 中的 loading 屬性使用');
  }
}

// 檢查所有可能的組件文件
const componentsDirPath = path.join(process.cwd(), 'app', 'components');
if (fs.existsSync(componentsDirPath)) {
  const componentFiles = fs.readdirSync(componentsDirPath).filter(file => file.endsWith('.tsx'));
  
  for (const file of componentFiles) {
    const filePath = path.join(componentsDirPath, file);
    console.log(`檢查 components/${file}...`);
    
    let fileContent = fs.readFileSync(filePath, 'utf8');
    
    if (fileContent.includes('loading,') && fileContent.includes('} = useAuth()')) {
      fileContent = fileContent.replace(
        /const \{([^}]*?)loading([^}]*?)\} = useAuth\(\);/,
        'const {$1isLoading: loading$2} = useAuth();'
      );
      
      fs.writeFileSync(filePath, fileContent);
      console.log(`已更新 components/${file} 中的 loading 屬性使用`);
    }
  }
}

console.log('驗證上下文類型問題修復完成'); 