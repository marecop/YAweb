export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  miles: number;
  level: 'Blue' | 'Silver' | 'Gold' | 'Platinum';
}

export const users: User[] = [
  {
    id: 'user_1',
    firstName: '張',
    lastName: '小明',
    email: 'test@example.com',
    password: 'password123',
    miles: 8500,
    level: 'Silver',
  },
  {
    id: 'user_2',
    firstName: '李',
    lastName: '小花',
    email: 'user@test.com',
    password: 'test123',
    miles: 25000,
    level: 'Gold',
  },
  {
    id: 'user_3',
    firstName: '王',
    lastName: '大同',
    email: 'admin@yellow.com',
    password: 'admin',
    miles: 60000,
    level: 'Platinum',
  },
]; 