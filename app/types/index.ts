// 用戶基礎類型定義
export type User = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  memberLevel?: number;
  isMember?: boolean;
  password: string;
  totalMiles?: number;
  createdAt?: string;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  country?: string;
  city?: string;
  postalCode?: string;
};

// 其他共享類型可以在這裡添加 