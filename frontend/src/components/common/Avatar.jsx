import React, { useState } from 'react';
import { getInitials } from '../../utils/avatarUtils';

export const Avatar = ({
  src,
  name = 'User',
  size = 'md',
  isOnline,
  showStatus = false,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-2xl',
  };

  const statusSizeClasses = {
    xs: 'w-2 h-2 ring-1',
    sm: 'w-2.5 h-2.5 ring-1.5',
    md: 'w-3 h-3 ring-2',
    lg: 'w-3.5 h-3.5 ring-2',
    xl: 'w-4 h-4 ring-2',
    '2xl': 'w-5 h-5 ring-4',
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;
  const currentStatusSize = statusSizeClasses[size] || statusSizeClasses.md;

  return (
    <div className={`relative inline-flex flex-shrink-0 items-center justify-center ${className}`}>
      <div
        className={`${currentSize} rounded-full overflow-hidden bg-gradient-to-tr from-brand-600 to-accent flex items-center justify-center text-white font-semibold shadow-sm ring-1 ring-black/5`}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {showStatus && isOnline !== undefined && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-white ${currentStatusSize} ${
            isOnline ? 'bg-emerald-500' : 'bg-slate-400'
          }`}
          title={isOnline ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
};

export default Avatar;
