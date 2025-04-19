// 會員等級工具函數 - 可以在客戶端和服務器端共用

/**
 * 根據總里程自動計算會員等級
 */
export function calculateMemberLevel(totalMiles: number): 'standard' | 'silver' | 'gold' | 'diamond' {
  if (totalMiles >= 100000) {
    return 'diamond';
  } else if (totalMiles >= 50000) {
    return 'gold';
  } else if (totalMiles >= 25000) {
    return 'silver';
  } else {
    return 'standard';
  }
}

/**
 * 獲取會員等級對應的中文名稱
 */
export function getMemberLevelName(level: string): string {
  switch (level) {
    case 'diamond':
      return '鑽石卡會員';
    case 'gold':
      return '金卡會員';
    case 'silver':
      return '銀卡會員';
    default:
      return '普通會員';
  }
}

// 會員等級顏色映射
export const memberLevelColors = {
  diamond: 'bg-purple-600 text-white',
  gold: 'bg-yellow-500 text-white',
  silver: 'bg-gray-400 text-white',
  standard: 'bg-gray-200 text-gray-700'
};

// 獲取會員等級對應的顏色類名
export function getMemberLevelColorClass(level: string): string {
  return memberLevelColors[level as keyof typeof memberLevelColors] || memberLevelColors.standard;
} 