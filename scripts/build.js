const { exec } = require('child_process');
const path = require('path');

// 編譯 TypeScript 文件
console.log('正在編譯 TypeScript 文件...');

// 使用 tsc 編譯 utils 和 types 目錄下的 TypeScript 文件
exec('npx tsc --project tsconfig.json', (error, stdout, stderr) => {
  if (error) {
    console.error(`編譯錯誤: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`編譯警告: ${stderr}`);
  }
  
  console.log('TypeScript 編譯完成！');
  console.log('開始生成航班數據...');
  
  // 編譯完成後，執行航班數據生成腳本
  require('./generateFlightData');
}); 