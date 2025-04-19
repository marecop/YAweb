'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
  formatPrice: (price: number) => string;
  exchangeRate: (currency: string) => number;
};

// 定義一個包含索引簽名的貨幣匯率類型
interface CurrencyRates {
  [key: string]: number;
  TWD: number;
  USD: number;
  EUR: number;
  JPY: number;
  GBP: number;
  AUD: number;
  CNY: number;
  HKD: number;
}

const currencyRates: CurrencyRates = {
  TWD: 1,
  USD: 0.032,
  EUR: 0.029,
  JPY: 4.9,
  GBP: 0.025,
  AUD: 0.049,
  CNY: 0.23,
  HKD: 0.25
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'TWD',
  setCurrency: () => {},
  formatPrice: () => '',
  exchangeRate: () => 1
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<string>('TWD');

  const formatPrice = (price: number): string => {
    const rate = currencyRates[currency] || 1;
    let convertedPrice = currency === 'TWD' ? price : price * rate;
    
    // 格式化價格，添加貨幣符號和千位分隔符
    const formatter = new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    return formatter.format(convertedPrice);
  };

  const exchangeRate = (targetCurrency: string): number => {
    if (currency === targetCurrency) return 1;
    const sourceCurrencyRate = currencyRates[currency] || 1;
    const targetCurrencyRate = currencyRates[targetCurrency] || 1;
    return targetCurrencyRate / sourceCurrencyRate;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, exchangeRate }}>
      {children}
    </CurrencyContext.Provider>
  );
}; 