'use client';

import { useState, useEffect, useRef } from 'react';
import { Airport, searchAirports, getPopularAirports } from '@/app/lib/airports';

interface AirportSearchInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (airportCode: string) => void;
  onLocationRequest?: () => void;
  showLocationButton?: boolean;
  isLocating?: boolean;
}

export default function AirportSearchInput({
  id,
  name,
  label,
  value,
  placeholder = '請輸入城市、機場或機場代碼（中文）',
  required = false,
  disabled = false,
  onChange,
  onLocationRequest,
  showLocationButton = false,
  isLocating = false
}: AirportSearchInputProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 當外部value變化時，更新當前顯示
  useEffect(() => {
    if (value) {
      import('@/app/lib/airports').then(({ getAirportByCode }) => {
        const airport = getAirportByCode(value);
        if (airport) {
          setSelectedAirport(airport);
          setQuery(`${airport.city} (${airport.code})`);
        } else {
          setSelectedAirport(null);
          setQuery('');
        }
      });
    } else {
      setSelectedAirport(null);
      setQuery('');
    }
  }, [value]);

  // 處理輸入變化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
    
    if (inputValue.trim() === '') {
      // 如果輸入為空，顯示熱門機場
      import('@/app/lib/airports').then(({ getPopularAirports }) => {
        setSuggestions(getPopularAirports());
      });
    } else {
      // 否則搜索匹配的機場
      import('@/app/lib/airports').then(({ searchAirports }) => {
        const results = searchAirports(inputValue);
        setSuggestions(results);
      });
    }
  };

  // 處理建議選擇
  const handleSelectSuggestion = (airport: Airport) => {
    setSelectedAirport(airport);
    setQuery(`${airport.city} (${airport.code})`);
    onChange(airport.code);
    setSuggestions([]);
    setFocused(false);
  };

  // 處理輸入框聚焦
  const handleFocus = () => {
    setFocused(true);
    if (query.trim() === '') {
      // 聚焦時顯示熱門機場
      import('@/app/lib/airports').then(({ getPopularAirports }) => {
        setSuggestions(getPopularAirports());
      });
    }
  };

  // 處理點擊外部區域關閉下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="py-3 px-4 w-full border border-gray-300 rounded-md shadow-sm focus:border-ya-yellow-500 focus:ring-ya-yellow-500"
          autoComplete="off"
        />
        {showLocationButton && onLocationRequest && (
          <button
            type="button"
            onClick={onLocationRequest}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ya-yellow-600 hover:text-ya-yellow-700"
            title="使用當前位置"
            disabled={isLocating || disabled}
          >
            <svg className={`w-5 h-5 ${isLocating ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </button>
        )}
      </div>
      
      {/* 搜索建議下拉框 */}
      {focused && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
        >
          <ul className="py-1">
            {suggestions.map((airport) => (
              <li 
                key={airport.code}
                onClick={() => handleSelectSuggestion(airport)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="font-medium">{airport.city}</div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <span className="mr-1">{airport.name}</span>
                      <span className="text-gray-400">•</span>
                      <span className="ml-1 font-mono">{airport.code}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{airport.country}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 