'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 定義支持的貨幣類型
export type Currency = 'HKD' | 'CNY' | 'USD' | 'EUR' | 'GBP';

// 定義貨幣符號
export const currencySymbols: Record<Currency, string> = {
  HKD: 'HK$',
  CNY: '¥',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

// 定義相對於港幣的匯率
export const exchangeRates: Record<Currency, number> = {
  HKD: 1.0,
  CNY: 0.91, // 1港幣 = 0.91人民幣
  USD: 0.13, // 1港幣 = 0.13美元
  EUR: 0.12, // 1港幣 = 0.12歐元
  GBP: 0.10  // 1港幣 = 0.10英鎊
};

// 定義幣種選項
export const currencyOptions = [
  { value: 'HKD', label: '港幣 (HKD)' },
  { value: 'CNY', label: '人民幣 (CNY)' },
  { value: 'USD', label: '美元 (USD)' },
  { value: 'EUR', label: '歐元 (EUR)' },
  { value: 'GBP', label: '英鎊 (GBP)' }
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (price: number, fromCurrency?: Currency) => number;
  formatPrice: (price: number, fromCurrency?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [currency, setCurrency] = useState<Currency>('HKD');

  useEffect(() => {
    // 從本地存儲加載之前選擇的貨幣
    const savedCurrency = localStorage.getItem('currency') as Currency;
    if (savedCurrency && Object.keys(exchangeRates).includes(savedCurrency)) {
      setCurrency(savedCurrency);
    }
  }, []);

  // 當貨幣改變時保存到本地存儲
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  // 轉換價格
  const convertPrice = (price: number, fromCurrency: Currency = 'HKD'): number => {
    // 先轉換為港幣
    const priceInHKD = price / exchangeRates[fromCurrency];
    // 再從港幣轉換為目標貨幣
    const convertedPrice = priceInHKD * exchangeRates[currency];
    return convertedPrice;
  };

  // 格式化價格顯示
  const formatPrice = (price: number, fromCurrency: Currency = 'HKD'): string => {
    const convertedPrice = convertPrice(price, fromCurrency);
    const symbol = currencySymbols[currency];
    
    // 根據不同貨幣使用不同的小數位數
    let decimals = 0;
    if (currency === 'HKD' || currency === 'CNY') {
      decimals = 0;
    } else {
      decimals = 2;
    }
    
    return `${symbol}${convertedPrice.toFixed(decimals)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}; 