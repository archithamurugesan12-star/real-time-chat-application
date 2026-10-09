import React from 'react';

export const LoadingSpinner = ({ size = 'md', text = '', fullScreen = false }) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeMap[size] || sizeMap.md} border-brand-200 border-t-brand-600 rounded-full animate-spin`}
      />
      {text && <p className="text-sm font-medium text-slate-600 animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
