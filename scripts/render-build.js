const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 正在安裝所有依賴...');

// 確保所有開發依賴也被安裝
try {
  execSync('npm install --also=dev', { stdio: 'inherit' });
  console.log('✅ 依賴安裝成功');
} catch (error) {
  console.error('❌ 依賴安裝失敗：', error);
  process.exit(1);
}

// 檢查tailwindcss是否正確安裝
try {
  execSync('npx tailwindcss --help', { stdio: 'ignore' });
  console.log('✅ Tailwind CSS 可用');
} catch (error) {
  console.log('⚠️ Tailwind CSS 找不到，正在單獨安裝...');
  try {
    execSync('npm install -g tailwindcss postcss autoprefixer', { stdio: 'inherit' });
    console.log('✅ Tailwind CSS 安裝成功');
  } catch (tailwindError) {
    console.error('❌ Tailwind CSS 安裝失敗：', tailwindError);
  }
}

console.log('🏗️ 開始構建...'); 