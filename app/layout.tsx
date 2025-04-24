import './globals.css';
import type { Metadata } from 'next';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';

export const metadata: Metadata = {
  title: '黃色航空 | Yellow Airlines',
  description: '輕鬆預訂您的下一次冒險旅程',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          <CurrencyProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 