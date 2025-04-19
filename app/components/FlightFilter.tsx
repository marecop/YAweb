'use client'

import { useState, useEffect } from 'react';

interface FilterOptions {
  directOnly: boolean;
  maxPrice: number;
  departureTimeRange: [number, number];
  airline: string;
}

interface FlightFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters: FilterOptions;
  maxPrice: number;
}

export default function FlightFilter({ onFilterChange, initialFilters, maxPrice }: FlightFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  // 處理過濾器變更
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // 處理時間範圍變更
  const handleTimeRangeChange = (start: number, end: number) => {
    const timeRange: [number, number] = [start, end];
    handleFilterChange('departureTimeRange', timeRange);
  };

  // 重置過濾器
  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      directOnly: false,
      maxPrice,
      departureTimeRange: [0, 24],
      airline: 'all'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">過濾條件</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-ya-yellow-600 hover:text-ya-yellow-700"
        >
          重置
        </button>
      </div>

      {/* 直飛 / 轉機 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">航班類型</h4>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.directOnly}
            onChange={(e) => handleFilterChange('directOnly', e.target.checked)}
            className="form-checkbox text-ya-yellow-500 h-5 w-5"
          />
          <span className="ml-2 text-gray-700">僅顯示直飛航班</span>
        </label>
      </div>

      {/* 價格範圍 */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">價格上限</h4>
          <span className="text-sm text-gray-500">${filters.maxPrice}</span>
        </div>
        <input
          type="range"
          min="0"
          max={maxPrice}
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">$0</span>
          <span className="text-xs text-gray-500">${maxPrice}</span>
        </div>
      </div>

      {/* 出發時間 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">出發時間</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleTimeRangeChange(0, 12)}
            className={`py-2 px-3 text-sm border rounded-md ${
              filters.departureTimeRange[0] === 0 && filters.departureTimeRange[1] === 12
                ? 'bg-ya-yellow-100 border-ya-yellow-500 text-ya-yellow-800'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            上午 (00:00-12:00)
          </button>
          <button
            onClick={() => handleTimeRangeChange(12, 24)}
            className={`py-2 px-3 text-sm border rounded-md ${
              filters.departureTimeRange[0] === 12 && filters.departureTimeRange[1] === 24
                ? 'bg-ya-yellow-100 border-ya-yellow-500 text-ya-yellow-800'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            下午 (12:00-24:00)
          </button>
        </div>
        <div className="mt-2">
          <button
            onClick={() => handleTimeRangeChange(0, 24)}
            className={`w-full py-2 px-3 text-sm border rounded-md ${
              filters.departureTimeRange[0] === 0 && filters.departureTimeRange[1] === 24
                ? 'bg-ya-yellow-100 border-ya-yellow-500 text-ya-yellow-800'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            全天 (00:00-24:00)
          </button>
        </div>
      </div>

      {/* 航空公司 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">航空公司</h4>
        <select
          value={filters.airline}
          onChange={(e) => handleFilterChange('airline', e.target.value)}
          className="select-field"
        >
          <option value="all">所有航空公司</option>
          <option value="YA">黃色航空 (YA)</option>
        </select>
      </div>
    </div>
  );
} 