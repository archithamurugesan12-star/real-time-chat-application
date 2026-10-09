import React from 'react';

export const StatusBadge = ({ isOnline = false, showLabel = true, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isOnline
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
          : 'bg-slate-100 text-slate-600 border border-slate-200'
      } ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
        }`}
      />
      {showLabel && <span>{isOnline ? 'Online' : 'Offline'}</span>}
    </span>
  );
};

export default StatusBadge;
