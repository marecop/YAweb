// 會員等級工具函數 - 可以在客戶端和服務器端共用

// 定義會員等級類型
export type MemberLevel = 'standard' | 'silver' | 'gold' | 'diamond';

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
    case 'gold': return '金卡會員';
    case 'silver': return '銀卡會員';
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
  return memberLevelColors[level] || memberLevelColors.standard;
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
};