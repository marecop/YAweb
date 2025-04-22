/**
 * 此腳本用於確保應用程序目錄結構正確
 * 創建任何缺失的目錄和文件
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('開始確保應用程序目錄結構...');

// 確保目錄存在
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`創建目錄: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  }
  return false;
}

// 確保基本目錄結構
const appDir = path.join(process.cwd(), 'app');
ensureDir(appDir);
ensureDir(path.join(appDir, 'auth'));
ensureDir(path.join(appDir, 'auth', 'login'));
ensureDir(path.join(appDir, 'auth', 'register'));
ensureDir(path.join(appDir, 'api'));
ensureDir(path.join(appDir, 'api', 'auth'));
ensureDir(path.join(appDir, 'bookings'));
ensureDir(path.join(appDir, 'components'));
ensureDir(path.join(appDir, 'contexts'));
ensureDir(path.join(appDir, 'lib'));
ensureDir(path.join(appDir, 'member'));
ensureDir(path.join(appDir, 'models'));
ensureDir(path.join(appDir, 'utils'));

// 檢查 register 頁面是否存在且內容正確
const registerPagePath = path.join(appDir, 'auth', 'register', 'page.tsx');
if (!fs.existsSync(registerPagePath) || fs.statSync(registerPagePath).size < 100) {
  console.log('註冊頁面不存在或大小異常，執行修復...');
  try {
    execSync('node scripts/fix-register-page.js');
  } catch (error) {
    console.error('執行修復腳本時出錯:', error);
  }
}

// 確保 next.config.js 存在
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (!fs.existsSync(nextConfigPath)) {
  console.log('創建 next.config.js');
  const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone'
};

module.exports = nextConfig;`;
  fs.writeFileSync(nextConfigPath, nextConfigContent, 'utf8');
}

// 確保 tsconfig.json 存在
const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
if (!fs.existsSync(tsconfigPath)) {
  console.log('創建 tsconfig.json');
  const tsconfigContent = `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`;
  fs.writeFileSync(tsconfigPath, tsconfigContent, 'utf8');
}

// 確保 .env 文件存在
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('創建 .env 文件');
  const envContent = `MONGODB_URI=mongodb+srv://render:Njf2JR65zcwLqV8b@yellow.8qpqjzm.mongodb.net/test?retryWrites=true&w=majority
MONGODB_DB=yellow_airlines`;
  fs.writeFileSync(envPath, envContent, 'utf8');
}

// 確保 .env.local 文件存在
const envLocalPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envLocalPath)) {
  console.log('創建 .env.local 文件');
  fs.writeFileSync(envLocalPath, fs.readFileSync(envPath), 'utf8');
}

// 確保 tailwind.config.js 存在
const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
if (!fs.existsSync(tailwindConfigPath)) {
  console.log('創建 tailwind.config.js');
  const tailwindConfigContent = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'ya-yellow': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
      },
    },
  },
  plugins: [],
}`;
  fs.writeFileSync(tailwindConfigPath, tailwindConfigContent, 'utf8');
}

// 確保 postcss.config.js 存在
const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');
if (!fs.existsSync(postcssConfigPath)) {
  console.log('創建 postcss.config.js');
  const postcssConfigContent = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
  fs.writeFileSync(postcssConfigPath, postcssConfigContent, 'utf8');
}

console.log('應用程序目錄結構檢查完成！'); 