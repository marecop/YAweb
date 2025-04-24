'use client';

import React from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  const bgColor = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700'
  }[type];

  return (
    <div className={`p-4 mb-4 rounded-md border-l-4 ${bgColor}`}>
      <p>{message}</p>
    </div>
  );
};

export default Alert; 