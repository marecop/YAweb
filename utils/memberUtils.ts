// 會員等級工具函數 - 可以在客戶端和服務器端共用

// 定義一個包含索引簽名的益處類型
interface MemberBenefits {
  [key: string]: string[];
  Bronze: string[];
  Silver: string[];
  Gold: string[];
  Platinum: string[];
  Diamond: string[];
}

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
interface MemberLevelColors {
  [key: string]: string;
  diamond: string;
  gold: string;
  silver: string;
  standard: string;
}

export const memberLevelColors: MemberLevelColors = {
  diamond: 'bg-purple-600 text-white',
  gold: 'bg-yellow-500 text-white',
  silver: 'bg-gray-400 text-white',
  standard: 'bg-gray-200 text-gray-700'
};

// 獲取會員等級對應的顏色類名
export function getMemberLevelColorClass(level: string): string {
  return memberLevelColors[level] || memberLevelColors.standard;
}

// 獲取會員等級對應的福利
export const getMemberBenefits = (level: string): string[] => {
  const benefits: MemberBenefits = {
    Bronze: ['免費托運行李 20kg', '線上優先辦理登機手續'],
    Silver: ['免費托運行李 30kg', '優先登機', '機場貴賓室使用權 (每年 2 次)'],
    Gold: ['免費托運行李 40kg', '優先登機', '機場貴賓室使用權 (無限次)', '免費選擇座位'],
    Platinum: ['免費托運行李 50kg', '優先登機', '機場貴賓室使用權 (無限次)', '免費選擇座位', '免費升等艙位 (每年 2 次)'],
    Diamond: ['免費托運行李 60kg', '優先登機', '機場貴賓室使用權 (無限次)', '免費選擇座位', '免費升等艙位 (每年 4 次)', '專屬客服專線']
  };
  
  return benefits[level] || [];
}; 