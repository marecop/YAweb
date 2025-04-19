'use client';

import { useState, useRef, useEffect } from 'react';
import { useCurrency, currencyOptions, Currency } from '@/app/contexts/CurrencyContext';

interface CurrencySelectorProps {
  className?: string;
  compact?: boolean;
}

export default function CurrencySelector({ className = '', compact = false }: CurrencySelectorProps) {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 處理點擊外部關閉下拉選單
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (value: Currency) => {
    setCurrency(value);
    setIsOpen(false);
  };

  // 獲取當前選擇的貨幣標籤
  const currentOption = currencyOptions.find(option => option.value === currency);

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-ya-yellow-500"
      >
        {compact ? (
          <span>{currency}</span>
        ) : (
          <span className="flex items-center">
            <span className="mr-1">{currentOption?.label || currency}</span>
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {currencyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value as Currency)}
                className={`block w-full text-left px-4 py-2 text-sm ${currency === option.value ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} hover:bg-gray-50`}
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 