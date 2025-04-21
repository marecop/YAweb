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

/**
 * 根據總里程計算會員等級
 * @param totalMiles 總里程
 * @returns 會員等級 (1-4)
 */
export function calculateMemberLevel(totalMiles) {
  if (totalMiles >= 100000) {
    return 4; // 白金會員
  } else if (totalMiles >= 50000) {
    return 3; // 金卡會員
  } else if (totalMiles >= 25000) {
    return 2; // 銀卡會員
  } else {
    return 1; // 普通會員
  }
}
