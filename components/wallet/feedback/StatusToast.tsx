'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface StatusToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export default function StatusToast({ type, message, duration = 5000, onClose }: StatusToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        setTimeout(onClose, 300); // Wait for fade out
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getStyles = () => {
    const baseStyles = 'browser-window border-4 rounded-lg p-4 shadow-lg flex items-start gap-3 min-w-[300px] max-w-[500px] transition-all duration-300';
    
    if (!isVisible) {
      return `${baseStyles} opacity-0 translate-y-2`;
    }

    switch (type) {
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
    switch (type) {
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
    switch (type) {
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

  if (!isVisible && !onClose) return null;

  return (
    <div className={getStyles()}>
      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-white ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
      }`}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className={`hand-drawn text-sm font-bold ${getTextColor()}`}>
          {message}
        </p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-500 hover:text-black text-lg font-bold"
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
}

