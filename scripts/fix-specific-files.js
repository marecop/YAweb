const fs = require('fs');
const path = require('path');

console.log('🔧 開始修復特定文件...');

// 需要修復的文件列表及其修復邏輯
const filesToFix = [
  {
    path: 'app/bookings/page.tsx',
    replacements: [
      {
        from: /from\s+['"]@\/app\/contexts\/AuthContext['"]/g,
        to: "from '../../contexts/AuthContext'"
      },
      {
        from: /from\s+['"]@\/app\/contexts\/CurrencyContext['"]/g,
        to: "from '../../contexts/CurrencyContext'"
      },
      {
        from: /from\s+['"]@\/utils\/bookingService['"]/g,
        to: "from '../../utils/bookingService'"
      }
    ]
  },
  {
    path: 'app/bookings/[bookingId]/page.tsx',
    replacements: [
      {
        from: /from\s+['"]@\/app\/contexts\/AuthContext['"]/g,
        to: "from '../../../contexts/AuthContext'"
      },
      {
        from: /from\s+['"]@\/app\/contexts\/CurrencyContext['"]/g,
        to: "from '../../../contexts/CurrencyContext'"
      },
      {
        from: /from\s+['"]@\/utils\/bookingService['"]/g,
        to: "from '../../../utils/bookingService'"
      }
    ]
  },
  {
    path: 'app/auth/login/page.tsx',
    replacements: [
      {
        from: /from\s+['"]@\/app\/contexts\/AuthContext['"]/g,
        to: "from '../../../contexts/AuthContext'"
      }
    ]
  },
  {
    path: 'app/auth/register/page.tsx',
    replacements: [
      {
        from: /from\s+['"]@\/app\/contexts\/AuthContext['"]/g,
        to: "from '../../../contexts/AuthContext'"
      }
    ]
  },
  {
    path: 'app/components/Header.tsx',
    replacements: [
      {
        from: /from\s+['"]@\/app\/contexts\/AuthContext['"]/g,
        to: "from '../../contexts/AuthContext'"
      },
      {
        from: /from\s+['"]@\/app\/contexts\/CurrencyContext['"]/g,
        to: "from '../../contexts/CurrencyContext'"
      },
      {
        from: /from\s+['"]@\/app\/utils\/memberUtils['"]/g,
        to: "from '../../utils/memberUtils'"
      },
      {
        from: /from\s+['"]@\/utils\/memberUtils['"]/g,
        to: "from '../../utils/memberUtils'"
      },
      {
        from: /from\s+['"]..\/..\/utils\/memberUtils['"]/g,
        to: "from '../../utils/memberUtils'"
      }
    ]
  },
  {
    path: 'app/components/MemberSidebar.tsx',
    replacements: [
      {
        from: /from\s+['"]@\/app\/contexts\/AuthContext['"]/g,
        to: "from '../../contexts/AuthContext'"
      },
      {
        from: /from\s+['"]@\/app\/utils\/memberUtils['"]/g,
        to: "from '../../utils/memberUtils'"
      },
      {
        from: /from\s+['"]@\/utils\/memberUtils['"]/g,
        to: "from '../../utils/memberUtils'"
      },
      {
        from: /from\s+['"]..\/..\/utils\/memberUtils['"]/g,
        to: "from '../../utils/memberUtils'"
      }
    ]
  },
  {
    path: 'app/member/layout.tsx',
    replacements: [
      {
        from: /from\s+['"]@\/app\/contexts\/AuthContext['"]/g,
        to: "from '../../contexts/AuthContext'"
      }
    ]
  },
  {
    path: 'app/member/page.tsx',
    replacements: [
      {
        from: /from\s+['"]@\/app\/contexts\/AuthContext['"]/g,
        to: "from '../../contexts/AuthContext'"
      },
      {
        from: /from\s+['"]@\/app\/utils\/memberUtils['"]/g,
        to: "from '../../utils/memberUtils'"
      },
      {
        from: /from\s+['"]@\/utils\/memberUtils['"]/g,
        to: "from '../../utils/memberUtils'"
      },
      {
        from: /from\s+['"]..\/..\/utils\/memberUtils['"]/g,
        to: "from '../../utils/memberUtils'"
      }
    ]
  },
  {
    path: 'app/flights/page.tsx',
    replacements: [
      {
        from: /from\s+['"]@\/app\/contexts\/AuthContext['"]/g,
        to: "from '../../contexts/AuthContext'"
      },
      {
        from: /from\s+['"]@\/app\/contexts\/CurrencyContext['"]/g,
        to: "from '../../contexts/CurrencyContext'"
      }
    ]
  },
  {
    path: 'app/baggage/page.tsx',
    replacements: [
      {
        from: /from\s+['"]@\/app\/contexts\/AuthContext['"]/g,
        to: "from '../../contexts/AuthContext'"
      }
    ]
  }
];

// 確保contexts目錄存在
const contextsDir = path.join(__dirname, '../contexts');
if (!fs.existsSync(contextsDir)) {
  fs.mkdirSync(contextsDir, { recursive: true });
  console.log(`   創建目錄: contexts`);
}

// 確保utils目錄存在
const utilsDir = path.join(__dirname, '../utils');
if (!fs.existsSync(utilsDir)) {
  fs.mkdirSync(utilsDir, { recursive: true });
  console.log(`   創建目錄: utils`);
}

// 確保app/utils目錄存在
const appUtilsDir = path.join(__dirname, '../app/utils');
if (!fs.existsSync(appUtilsDir)) {
  fs.mkdirSync(appUtilsDir, { recursive: true });
  console.log(`   創建目錄: app/utils`);
}

// 創建必要的memberUtils.ts文件
const memberUtilsPath = path.join(utilsDir, 'memberUtils.ts');
const memberUtilsContent = `
export const getMemberLevelName = (level: number): string => {
  switch (level) {
    case 1:
      return '普通會員';
    case 2:
      return '銀卡會員';
    case 3:
      return '金卡會員';
    case 4:
      return '白金會員';
    default:
      return '未知會員等級';
  }
};

export const getMemberLevelColorClass = (level: number): string => {
  switch (level) {
    case 1:
      return 'text-gray-500';
    case 2:
      return 'text-silver-500';
    case 3:
      return 'text-gold-500';
    case 4:
      return 'text-platinum-500';
    default:
      return 'text-gray-500';
  }
};
`;

// 在根目錄下的 utils 中創建文件
if (!fs.existsSync(memberUtilsPath)) {
  console.log(`   創建文件: utils/memberUtils.ts`);
  fs.writeFileSync(memberUtilsPath, memberUtilsContent);
}

// 在 app/utils 中創建文件
const appMemberUtilsPath = path.join(appUtilsDir, 'memberUtils.ts');
if (!fs.existsSync(appMemberUtilsPath)) {
  console.log(`   創建文件: app/utils/memberUtils.ts`);
  fs.writeFileSync(appMemberUtilsPath, memberUtilsContent);
}

// 創建必要的AuthContext文件
const authContextPath = path.join(contextsDir, 'AuthContext.tsx');
if (!fs.existsSync(authContextPath)) {
  console.log(`   創建文件: contexts/AuthContext.tsx`);
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

// 創建必要的CurrencyContext文件
const currencyContextPath = path.join(contextsDir, 'CurrencyContext.tsx');
if (!fs.existsSync(currencyContextPath)) {
  console.log(`   創建文件: contexts/CurrencyContext.tsx`);
  fs.writeFileSync(currencyContextPath, `
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
  formatPrice: (price: number) => string;
  exchangeRate: (currency: string) => number;
};

const currencyRates = {
  TWD: 1,
  USD: 0.032,
  EUR: 0.029,
  JPY: 4.9,
  GBP: 0.025,
  AUD: 0.049,
  CNY: 0.23,
  HKD: 0.25
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'TWD',
  setCurrency: () => {},
  formatPrice: () => '',
  exchangeRate: () => 1
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<string>('TWD');

  const formatPrice = (price: number): string => {
    const rate = currencyRates[currency] || 1;
    let convertedPrice = currency === 'TWD' ? price : price * rate;
    
    // 格式化價格，添加貨幣符號和千位分隔符
    const formatter = new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    return formatter.format(convertedPrice);
  };

  const exchangeRate = (targetCurrency: string): number => {
    if (currency === targetCurrency) return 1;
    const sourceCurrencyRate = currencyRates[currency] || 1;
    const targetCurrencyRate = currencyRates[targetCurrency] || 1;
    return targetCurrencyRate / sourceCurrencyRate;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, exchangeRate }}>
      {children}
    </CurrencyContext.Provider>
  );
};
`);
}

// 修正 app/components/Header.tsx
const headerFilePath = path.join(__dirname, '../app/components/Header.tsx');
if (fs.existsSync(headerFilePath)) {
  console.log(`   直接修復: app/components/Header.tsx`);
  
  let headerContent = fs.readFileSync(headerFilePath, 'utf8');
  
  // 修改 Header.tsx 的導入語句
  const updatedHeaderContent = headerContent.replace(
    /import\s+{\s*getMemberLevelName\s*,\s*getMemberLevelColorClass\s*}\s+from\s+(['"]).*?(['"])/g,
    "import { getMemberLevelName, getMemberLevelColorClass } from '../utils/memberUtils'"
  );
  
  if (updatedHeaderContent !== headerContent) {
    fs.writeFileSync(headerFilePath, updatedHeaderContent, 'utf8');
    console.log(`   ✅ 已修復: app/components/Header.tsx 的導入語句`);
  } else {
    console.log(`   ⚠️ 沒有找到需要修復的導入語句: app/components/Header.tsx`);
  }
}

// 修正 app/member/page.tsx
const memberPagePath = path.join(__dirname, '../app/member/page.tsx');
if (fs.existsSync(memberPagePath)) {
  console.log(`   直接修復: app/member/page.tsx`);
  
  let memberPageContent = fs.readFileSync(memberPagePath, 'utf8');
  
  // 修改 member/page.tsx 的導入語句
  const updatedMemberPageContent = memberPageContent.replace(
    /import\s+{\s*getMemberLevelName\s*,\s*getMemberLevelColorClass\s*}\s+from\s+(['"]).*?(['"])/g,
    "import { getMemberLevelName, getMemberLevelColorClass } from '../utils/memberUtils'"
  );
  
  if (updatedMemberPageContent !== memberPageContent) {
    fs.writeFileSync(memberPagePath, updatedMemberPageContent, 'utf8');
    console.log(`   ✅ 已修復: app/member/page.tsx 的導入語句`);
  } else {
    console.log(`   ⚠️ 沒有找到需要修復的導入語句: app/member/page.tsx`);
  }
}

// 修復文件
let fixedCount = 0;
filesToFix.forEach(file => {
  const filePath = path.join(__dirname, '..', file.path);
  
  if (fs.existsSync(filePath)) {
    console.log(`   處理文件: ${file.path}`);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    file.replacements.forEach(replacement => {
      const newContent = content.replace(replacement.from, replacement.to);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   ✅ 已修復: ${file.path}`);
      fixedCount++;
    } else {
      console.log(`   ⚠️ 無需修復: ${file.path}`);
    }
  } else {
    console.log(`   ❌ 文件不存在: ${file.path}`);
  }
});

console.log(`🎉 完成！共修復了 ${fixedCount} 個文件。`); 