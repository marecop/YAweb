const fs = require('fs');
const path = require('path');

console.log('開始修復會員工具文件...');

// memberUtils.ts 路徑
const memberUtilsPath = path.join(process.cwd(), 'app', 'utils', 'memberUtils.ts');

// 確保目錄存在
if (!fs.existsSync(path.dirname(memberUtilsPath))) {
  fs.mkdirSync(path.dirname(memberUtilsPath), { recursive: true });
  console.log('已創建 utils 目錄');
}

// 創建或更新會員工具檔案
const memberUtilsContent = `// 會員等級工具函數 - 可以在客戶端和服務器端共用

// 定義會員等級類型
export type MemberLevel = 'Blue' | 'Silver' | 'Gold' | 'Platinum';

/**
 * 根據總里程自動計算會員等級
 */
export function calculateMemberLevel(totalMiles: number): MemberLevel {
  if (totalMiles >= 100000) {
    return 'Platinum';
  } else if (totalMiles >= 50000) {
    return 'Gold';
  } else if (totalMiles >= 25000) {
    return 'Silver';
  } else {
    return 'Blue';
  }
}

/**
 * 獲取會員等級對應的中文名稱
 */
export function getMemberLevelName(level: string): string {
  switch (level) {
    case 'Platinum':
      return '白金卡會員';
    case 'Gold':
      return '金卡會員';
    case 'Silver':
      return '銀卡會員';
    default:
      return '藍卡會員';
  }
}

// 會員等級顏色映射
interface MemberLevelColors {
  [key: string]: string;
  Platinum: string;
  Gold: string;
  Silver: string;
  Blue: string;
}

export const memberLevelColors: MemberLevelColors = {
  Platinum: 'bg-purple-600 text-white',
  Gold: 'bg-yellow-500 text-white',
  Silver: 'bg-gray-400 text-white',
  Blue: 'bg-blue-200 text-gray-700'
};

// 獲取會員等級對應的顏色類名
export function getMemberLevelColorClass(level: string): string {
  return memberLevelColors[level] || memberLevelColors.Blue;
}

// 獲取會員等級對應的福利
export const getMemberBenefits = (level: string): string[] => {
  const benefits: Record<string, string[]> = {
    Blue: ['免費托運行李 20kg', '線上優先辦理登機手續'],
    Silver: ['免費托運行李 30kg', '優先登機', '機場貴賓室使用權 (每年 2 次)'],
    Gold: ['免費托運行李 40kg', '優先登機', '機場貴賓室使用權 (無限次)', '免費選擇座位'],
    Platinum: ['免費托運行李 50kg', '優先登機', '機場貴賓室使用權 (無限次)', '免費選擇座位', '免費升等艙位 (每年 2 次)']
  };
  
  return benefits[level] || [];
};`;

fs.writeFileSync(memberUtilsPath, memberUtilsContent);
console.log('已創建/更新 memberUtils.ts 檔案');

// 檢查 app/api/miles/route.ts
const milesRoutePath = path.join(process.cwd(), 'app', 'api', 'miles', 'route.ts');
if (fs.existsSync(milesRoutePath)) {
  let milesRouteContent = fs.readFileSync(milesRoutePath, 'utf8');
  
  // 確保正確導入 calculateMemberLevel
  if (milesRouteContent.includes('import { calculateMemberLevel }')) {
    console.log('app/api/miles/route.ts 已經正確導入 calculateMemberLevel');
  } else {
    // 尋找導入部分並添加 calculateMemberLevel
    milesRouteContent = milesRouteContent.replace(
      /import {([^}]*)}/,
      'import {$1, calculateMemberLevel }'
    );
    
    fs.writeFileSync(milesRoutePath, milesRouteContent);
    console.log('已更新 app/api/miles/route.ts 的導入');
  }
} else {
  console.log('找不到 app/api/miles/route.ts 檔案');
}

console.log('會員工具文件修復完成'); 