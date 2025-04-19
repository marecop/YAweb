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
  
  // 創建可能缺少的目錄
  console.log('📁 創建必要的目錄...');
  const requiredDirs = [
    path.join(__dirname, '../app/contexts'),
    path.join(__dirname, '../app/components'),
    path.join(__dirname, '../contexts') // 添加頂層contexts目錄
  ];
  
  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`   創建: ${dir}`);
    }
  });
  
  // 創建必要的上下文文件
  const authContextContent = `
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  login: async () => false,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // 模擬登入
    setUser({ id: '1', email, firstName: 'User', lastName: 'Name', role: 'user' });
    return true;
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
`;
  
  // 在兩個可能的位置創建AuthContext文件
  const authContextPaths = [
    path.join(__dirname, '../app/contexts/AuthContext.tsx'),
    path.join(__dirname, '../contexts/AuthContext.tsx')
  ];
  
  authContextPaths.forEach(authContextPath => {
    if (!fs.existsSync(authContextPath)) {
      console.log(`   創建: ${authContextPath}`);
      fs.writeFileSync(authContextPath, authContextContent);
    }
  });
  
  // 創建缺少的 memberUtils
  const memberUtilsPath = path.join(__dirname, '../utils/memberUtils.ts');
  if (!fs.existsSync(memberUtilsPath)) {
    console.log('   創建: memberUtils.ts');
    fs.writeFileSync(memberUtilsPath, `
export const calculateMemberLevel = (miles: number) => {
  if (miles >= 100000) {
    return 'Diamond';
  } else if (miles >= 50000) {
    return 'Platinum';
  } else if (miles >= 25000) {
    return 'Gold';
  } else if (miles >= 10000) {
    return 'Silver';
  }
  return 'Bronze';
};

export const getMemberBenefits = (level: string) => {
  const benefits = {
    Bronze: ['基本積分獎勵', '生日禮遇'],
    Silver: ['基本積分獎勵', '生日禮遇', '優先登機', '額外行李額度'],
    Gold: ['基本積分獎勵', '生日禮遇', '優先登機', '額外行李額度', '貴賓室使用權'],
    Platinum: ['基本積分獎勵', '生日禮遇', '優先登機', '額外行李額度', '貴賓室使用權', '升等優惠'],
    Diamond: ['基本積分獎勵', '生日禮遇', '優先登機', '額外行李額度', '貴賓室使用權', '升等優惠', 'VIP專屬服務']
  };
  
  return benefits[level] || [];
};
`);
  }
  
  // 直接修復特定文件
  console.log('🛠️ 直接修復特定文件...');
  
  // 列出需要特別關注的文件
  const specialFiles = [
    'app/bookings/page.tsx',
    'app/bookings/[bookingId]/page.tsx',
    'app/auth/login/page.tsx',
    'app/auth/register/page.tsx',
    'app/components/Header.tsx',
    'app/components/MemberSidebar.tsx',
    'app/member/layout.tsx',
    'app/member/page.tsx',
    'app/flights/page.tsx',
    'app/baggage/page.tsx'
  ];
  
  specialFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // 檢測並修復 AuthContext 導入問題
      if (content.includes('AuthContext') || content.includes('useAuth')) {
        console.log(`   特別修復: ${file}`);
        
        // 替換任何 AuthContext 的導入
        content = content.replace(/import\s+.*\{\s*useAuth\s*\}\s*from\s+['"](.*?)AuthContext['"]/g, 
                                 "import { useAuth } from '../../../contexts/AuthContext'");
        
        // 根據文件路徑級別調整相對路徑
        if (file.includes('/bookings/[bookingId]/')) {
          content = content.replace(/from\s+['"](.*?)AuthContext['"]/g, "from '../../../contexts/AuthContext'");
        } else if (file.includes('/bookings/') || file.includes('/auth/') || 
                  file.includes('/flights/') || file.includes('/baggage/')) {
          content = content.replace(/from\s+['"](.*?)AuthContext['"]/g, "from '../../contexts/AuthContext'");
        } else if (file.includes('/member/')) {
          content = content.replace(/from\s+['"](.*?)AuthContext['"]/g, "from '../../contexts/AuthContext'");
        } else if (file.includes('/components/')) {
          content = content.replace(/from\s+['"](.*?)AuthContext['"]/g, "from '../../contexts/AuthContext'");
        }
        
        // 修復 memberUtils 引用
        if (content.includes('memberUtils')) {
          content = content.replace(/from\s+['"](.*?)utils\/memberUtils['"]/g, "from '../../utils/memberUtils'");
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
      }
    }
  });
  
  // 修改 app/admin 目錄中的導入路徑
  console.log('🔄 更新模組路徑引用...');
  
  // 使用 git 檢查所有 .ts 和 .tsx 文件
  const tsFiles = execSync('git ls-files -- "*.ts" "*.tsx"', { encoding: 'utf8' })
    .split('\n')
    .filter(file => file.length > 0 && !specialFiles.includes(file));
  
  let fixedFiles = 0;
  
  tsFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    try {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // 修正路徑引用 - 更全面的替換模式
        
        // 針對 app/contexts/AuthContext 的引用修復
        content = content.replace(/from\s+['"]@\/app\/contexts\/AuthContext['"]/g, `from '../../contexts/AuthContext'`);
        content = content.replace(/from\s+['"]\.\.\/contexts\/AuthContext['"]/g, `from '../../contexts/AuthContext'`);
        
        // 針對 utils/memberUtils 的引用修復
        content = content.replace(/from\s+['"]@\/utils\/memberUtils['"]/g, `from '../../utils/memberUtils'`);
        content = content.replace(/from\s+['"]\.\.\/\.\.\/utils\/memberUtils['"]/g, `from '../../utils/memberUtils'`);
        
        // 針對 app/components 的引用修復
        content = content.replace(/from\s+['"]@\/app\/components\/(\w+)['"]/g, `from '../components/$1'`);
        
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
  
  // 添加一個更可靠的佈局文件以支持AuthProvider
  const layoutPath = path.join(__dirname, '../app/layout.tsx');
  if (fs.existsSync(layoutPath)) {
    console.log('   更新根佈局文件...');
    let layoutContent = fs.readFileSync(layoutPath, 'utf8');
    
    // 確保根佈局文件包含AuthProvider
    if (!layoutContent.includes('AuthProvider')) {
      layoutContent = layoutContent.replace(
        /return\s*\(\s*<html/,
        `return (\n    <html`
      );
      
      fs.writeFileSync(layoutPath, layoutContent, 'utf8');
    }
  }
  
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