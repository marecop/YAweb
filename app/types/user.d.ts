// 用戶類型擴展
import type { User } from '../types';

// 擴展 User 類型 (如果需要)
declare module '../types' {
  interface User {
    // 這裡可以添加或覆蓋其他屬性
    role: string;
  }
}
