const fs = require('fs');
const path = require('path');

console.log('🔧 開始修復 memberUtils.js 文件...');

// 確保 app/utils 目錄存在
const appUtilsDir = path.join(__dirname, '../app/utils');
if (!fs.existsSync(appUtilsDir)) {
  fs.mkdirSync(appUtilsDir, { recursive: true });
  console.log(`   創建目錄: app/utils`);
}

// 創建 app/utils/memberUtils.js
const memberUtilsJsPath = path.join(appUtilsDir, 'memberUtils.js');
const memberUtilsJsContent = `
export function getMemberLevelName(level) {
  switch (Number(level)) {
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
}

export function getMemberLevelColorClass(level) {
  switch (Number(level)) {
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
}
`;

fs.writeFileSync(memberUtilsJsPath, memberUtilsJsContent);
console.log(`   ✅ 創建/更新文件: app/utils/memberUtils.js`);

console.log('🎉 完成！已修復 memberUtils.js 文件。'); 