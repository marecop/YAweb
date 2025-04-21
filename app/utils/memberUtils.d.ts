/**
 * 根據會員等級返回會員等級名稱
 * @param level 會員等級 (1-4)
 * @returns 會員等級名稱
 */
export function getMemberLevelName(level: number | string): string;

/**
 * 根據會員等級返回會員等級顏色樣式類名
 * @param level 會員等級 (1-4)
 * @returns 顏色樣式類名
 */
export function getMemberLevelColorClass(level: number | string): string;

/**
 * 根據總里程計算會員等級
 * @param totalMiles 總里程
 * @returns 會員等級 (1-4)
 */
export function calculateMemberLevel(totalMiles: number): number;
