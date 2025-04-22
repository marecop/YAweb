const fs = require('fs');
const path = require('path');

console.log('開始修復特定文件和路徑...');

// 確保 contexts 目錄存在
const contextsDir = path.join(process.cwd(), 'app', 'contexts');
if (!fs.existsSync(contextsDir)) {
  console.log('創建 contexts 目錄...');
  fs.mkdirSync(contextsDir, { recursive: true });
}

// 定義需要修復的文件
const filesToFix = [
  {
    path: 'app/bookings/page.tsx',
    replacements: [
      {
        from: /@\/app\/contexts\/AuthContext/g,
        to: '../../contexts/AuthContext'
      },
      {
        from: /@\/app\/contexts\/CurrencyContext/g,
        to: '../../contexts/CurrencyContext'
      }
    ]
  },
  {
    path: 'app/bookings/[bookingId]/page.tsx',
    replacements: [
      {
        from: /@\/app\/contexts\/AuthContext/g,
        to: '../../../contexts/AuthContext'
      },
      {
        from: /@\/app\/contexts\/CurrencyContext/g,
        to: '../../../contexts/CurrencyContext'
      }
    ]
  },
  {
    path: 'app/auth/login/page.tsx',
    replacements: [
      {
        from: /@\/app\/contexts\/AuthContext/g,
        to: '../../../contexts/AuthContext'
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
        from: /@\/app\/contexts\/AuthContext/g,
        to: '../contexts/AuthContext'
      },
      {
        from: /@\/app\/contexts\/CurrencyContext/g,
        to: '../contexts/CurrencyContext'
      },
      {
        from: /from\s+['"]@\/app\/utils\/memberUtils['"]/g,
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
        from: /@\/app\/contexts\/AuthContext/g,
        to: '../../contexts/AuthContext'
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
  },
  // 修復 MongoDB 連接字符串配置
  {
    path: 'app/lib/mongodb.ts',
    replacements: [
      {
        from: /const MONGODB_URI = process\.env\.MONGODB_URI \|\| ['"]mongodb\+srv:\/\/youruser:yourpassword@cluster0\.mongodb\.net\/yellairlines\?retryWrites=true&w=majority['"];/g,
        to: 'const MONGODB_URI = process.env.MONGODB_URI || \'mongodb+srv://yelluser:yell2024pass@cluster0.atvupvb.mongodb.net/yellairlines?retryWrites=true&w=majority\';'
      }
    ]
  }
];

// 設置環境變數檢查和自動降級到模擬數據庫
const envConfigToAdd = `
// 環境變數檢查和配置
export function getMongoDBConfig() {
  const isProduction = process.env.NODE_ENV === 'production';
  const useMockDB = process.env.USE_MOCK_DB === 'true';
  const mongodbUri = process.env.MONGODB_URI || 'mongodb+srv://yelluser:yell2024pass@cluster0.atvupvb.mongodb.net/yellairlines?retryWrites=true&w=majority';
  
  return {
    isProduction,
    useMockDB,
    mongodbUri,
    shouldUseMockDB: useMockDB || !mongodbUri.includes('mongodb')
  };
}
`;

// 檢查 mongodb.ts 文件以添加配置函數
const mongodbFilePath = path.join(process.cwd(), 'app', 'lib', 'mongodb.ts');
if (fs.existsSync(mongodbFilePath)) {
  let mongodbContent = fs.readFileSync(mongodbFilePath, 'utf8');
  if (!mongodbContent.includes('getMongoDBConfig')) {
    // 找到文件的末尾，但在 export default 語句之前
    const exportDefaultIndex = mongodbContent.lastIndexOf('export default');
    if (exportDefaultIndex !== -1) {
      mongodbContent = mongodbContent.slice(0, exportDefaultIndex) + envConfigToAdd + mongodbContent.slice(exportDefaultIndex);
      fs.writeFileSync(mongodbFilePath, mongodbContent, 'utf8');
      console.log('更新了 MongoDB 配置函數到 app/lib/mongodb.ts');
    }
  }
}

// 處理每個文件
let fixedCount = 0;
for (const file of filesToFix) {
  const filePath = path.join(process.cwd(), file.path);
  
  if (!fs.existsSync(filePath)) {
    console.log(`文件不存在，跳過: ${file.path}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const replacement of file.replacements) {
    if (replacement.from.test(content)) {
      content = content.replace(replacement.from, replacement.to);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 已修復文件: ${file.path}`);
    fixedCount++;
  } else {
    console.log(`⏭️ 文件不需要修復: ${file.path}`);
  }
}

console.log(`修復完成。共修復了 ${fixedCount} 個文件。`);

// 檢查 .env 文件並添加 MongoDB 配置
const envFilePath = path.join(process.cwd(), '.env');
const envLocalFilePath = path.join(process.cwd(), '.env.local');

const envContent = `# MongoDB 配置
MONGODB_URI=mongodb+srv://yelluser:yell2024pass@cluster0.atvupvb.mongodb.net/yellairlines?retryWrites=true&w=majority
# 設置為 true 可以使用模擬數據庫 (不需要真實連接)
USE_MOCK_DB=false
`;

// 創建或更新 .env 文件
if (!fs.existsSync(envFilePath)) {
  fs.writeFileSync(envFilePath, envContent, 'utf8');
  console.log('創建了新的 .env 文件，包含 MongoDB 配置');
} else {
  let existingEnvContent = fs.readFileSync(envFilePath, 'utf8');
  if (!existingEnvContent.includes('MONGODB_URI=')) {
    fs.writeFileSync(envFilePath, existingEnvContent + '\n' + envContent, 'utf8');
    console.log('更新了 .env 文件，添加了 MongoDB 配置');
  }
}

// 創建或更新 .env.local 文件
if (!fs.existsSync(envLocalFilePath)) {
  fs.writeFileSync(envLocalFilePath, envContent, 'utf8');
  console.log('創建了新的 .env.local 文件，包含 MongoDB 配置');
} else {
  let existingEnvLocalContent = fs.readFileSync(envLocalFilePath, 'utf8');
  if (!existingEnvLocalContent.includes('MONGODB_URI=')) {
    fs.writeFileSync(envLocalFilePath, existingEnvLocalContent + '\n' + envContent, 'utf8');
    console.log('更新了 .env.local 文件，添加了 MongoDB 配置');
  }
}

console.log('所有修復操作已完成！'); 