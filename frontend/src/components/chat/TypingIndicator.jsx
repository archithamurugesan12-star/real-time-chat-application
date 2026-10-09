import React from 'react';

export const TypingIndicator = ({ userName = 'User' }) => {
  return (
    <div className="flex items-center gap-2 py-2 px-4 animate-fade-in">
      <div className="bg-slate-200/80 backdrop-blur-xs py-2 px-3.5 rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />
      </div>
      <span className="text-[11px] font-medium text-slate-500 italic">
        {userName} is typing...
      </span>
    </div>
  );
};

export default TypingIndicator;
