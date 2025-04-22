'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

interface Flight {
  id: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    time: string;
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
  };
  aircraft: string;
  price: number;
  seats: {
    economy: number;
    business: number;
    first: number;
  };
  status: 'scheduled' | 'delayed' | 'cancelled' | 'boarding' | 'departed' | 'arrived';
}

export default function FlightsManagement() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState<string | null>(null);

  // 獲取航班列表
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'list',
            entityType: 'flight'
          }),
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('獲取航班數據失敗');
        }

        const data = await response.json();
        setFlights(data.flights || []);
      } catch (err) {
        console.error('獲取航班列表失敗:', err);
        setError('無法載入航班數據，請稍後再試');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  // 過濾航班
  const filteredFlights = flights.filter(flight =>
    flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flight.departure.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flight.arrival.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 獲取狀態顏色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'delayed': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'boarding': return 'bg-purple-100 text-purple-800';
      case 'departed': return 'bg-green-100 text-green-800';
      case 'arrived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 格式化航班狀態為中文
  const formatStatus = (status: string) => {
    switch (status) {
      case 'scheduled': return '計劃';
      case 'delayed': return '延誤';
      case 'cancelled': return '取消';
      case 'boarding': return '登機中';
      case 'departed': return '已起飛';
      case 'arrived': return '已抵達';
      default: return status;
    }
  };

  // 格式化日期時間
  const formatDateTime = (timeString: string) => {
    const date = new Date(timeString);
    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  if (loading && flights.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ya-yellow-500"></div>
        <span className="ml-3 text-lg text-gray-700">載入航班數據中...</span>
      </div>
    );
  }

  if (error && flights.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-2xl mx-auto mt-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">錯誤</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">航班管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            管理系統所有航班，查看和更新航班狀態。
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-ya-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-ya-yellow-700 focus:outline-none focus:ring-2 focus:ring-ya-yellow-500 focus:ring-offset-2 sm:w-auto"
          >
            <FaPlus className="mr-2" /> 新增航班
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">錯誤</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between items-center">
        <div className="relative rounded-md shadow-sm max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-ya-yellow-500 focus:border-ya-yellow-500 sm:text-sm"
            placeholder="搜尋航班..."
          />
        </div>
      </div>

      {/* 航班列表 */}
      <div className="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">航班編號</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">出發</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">到達</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">機型</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">價格</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">狀態</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">操作</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredFlights.map((flight) => (
              <tr key={flight.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {flight.flightNumber}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div>{flight.departure.city} ({flight.departure.airport})</div>
                  <div className="text-xs text-gray-400">{formatDateTime(flight.departure.time)}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div>{flight.arrival.city} ({flight.arrival.airport})</div>
                  <div className="text-xs text-gray-400">{formatDateTime(flight.arrival.time)}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{flight.aircraft}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">NT$ {flight.price.toLocaleString()}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(flight.status)}`}>
                    {formatStatus(flight.status)}
                  </span>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <FaEdit className="inline mr-1" /> 編輯
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash className="inline mr-1" /> 刪除
                  </button>
                </td>
              </tr>
            ))}
            {filteredFlights.length === 0 && (
              <tr>
                <td colSpan={7} className="py-4 text-center text-sm text-gray-500">
                  沒有找到符合條件的航班
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 