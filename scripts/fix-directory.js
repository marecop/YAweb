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
    path.join(__dirname, '../app/components')
  ];
  
  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`   創建: ${dir}`);
    }
  });
  
  // 創建必要的上下文文件
  const authContextPath = path.join(__dirname, '../app/contexts/AuthContext.tsx');
  if (!fs.existsSync(authContextPath)) {
    console.log('   創建: AuthContext.tsx');
    fs.writeFileSync(authContextPath, `
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
`);
  }
  
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
        
        // 修正路徑引用 - 更全面的替換模式
        
        // 針對 app/contexts/AuthContext 的引用修復
        content = content.replace(/from\s+['"]@\/app\/contexts\/AuthContext['"]/g, `from '../contexts/AuthContext'`);
        content = content.replace(/from\s+['"]\.\.\/contexts\/AuthContext['"]/g, `from '../contexts/AuthContext'`);
        
        // 針對 utils/memberUtils 的引用修復
        content = content.replace(/from\s+['"]@\/utils\/memberUtils['"]/g, `from '../../utils/memberUtils'`);
        content = content.replace(/from\s+['"]\.\.\/\.\.\/utils\/memberUtils['"]/g, `from '../../utils/memberUtils'`);
        
        // 針對 app/components 的引用修復
        content = content.replace(/from\s+['"]@\/app\/components\/(\w+)['"]/g, `from '../components/$1'`);
        
        // 特定文件的特別處理
        if (file.includes('app/auth/')) {
          content = content.replace(/from\s+['"]\.\.\/contexts\/AuthContext['"]/g, `from '../../contexts/AuthContext'`);
        }
        
        if (file.includes('app/bookings/')) {
          content = content.replace(/from\s+['"]\.\.\/contexts\/AuthContext['"]/g, `from '../../contexts/AuthContext'`);
        }
        
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