'use client';

import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const getStyles = () => {
    const baseStyles = 'browser-window border-4 rounded-lg p-4 mb-3 shadow-lg flex items-start gap-3 min-w-[300px] max-w-[500px]';
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-500`;
      default:
        return `${baseStyles} bg-white border-black`;
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-black';
    }
  };

  return (
    <div className={getStyles()}>
      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-white ${
        toast.type === 'success' ? 'bg-green-500' :
        toast.type === 'error' ? 'bg-red-500' :
        toast.type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
      }`}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className={`hand-drawn text-sm font-bold ${getTextColor()}`}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 text-gray-500 hover:text-black text-lg font-bold"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

