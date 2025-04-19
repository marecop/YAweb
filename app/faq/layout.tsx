import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '常見問題 | 黃色航空 Yellow Airlines',
  description: '查詢黃色航空的常見問題解答，了解訂票、行李、登機和其他旅行相關資訊',
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 