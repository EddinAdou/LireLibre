import React from 'react';

interface ToastProps {
  type: 'success' | 'error' | 'warning';
  message: string;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
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
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
    }
  };

  return (
    <div className={`border rounded-md p-4 ${getBackgroundColor()}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <span className={`text-lg font-bold ${getIconColor()}`}>
            {getIcon()}
          </span>
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${getTextColor()}`}>
            {message}
          </p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${getTextColor()} hover:bg-opacity-20`}
              >
                <span className="sr-only">Dismiss</span>
                <span className="text-lg">×</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toast;
