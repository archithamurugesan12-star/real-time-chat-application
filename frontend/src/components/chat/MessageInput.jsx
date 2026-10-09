import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const QUICK_EMOJIS = ['👋', '👍', '❤️', '🔥', '🎉', '😊', '🚀', '✨', '😂', '👏'];

export const MessageInput = () => {
  const [text, setText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const { sendMessage, emitTyping, isSending } = useChat();
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Handle typing indicator debouncing
  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val.length <= 2000) {
      setText(val);
    }

    // Emit typing status
    emitTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(false);
    }, 1500);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim() || isSending) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    emitTyping(false);

    const messageToSend = text;
    setText('');
    setShowEmojis(false);
    await sendMessage(messageToSend);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  return (
    <div className="p-3 sm:p-4 bg-white border-t border-slate-200/90 relative">
      {/* Quick Emojis Popover */}
      {showEmojis && (
        <div className="absolute bottom-full left-4 mb-2 p-2 bg-white rounded-2xl shadow-xl border border-slate-200 flex items-center gap-1.5 z-20 animate-fade-in">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => addEmoji(emoji)}
              className="text-lg p-1.5 hover:bg-slate-100 rounded-lg transition-transform hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowEmojis((prev) => !prev)}
            className={`p-2 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition-colors ${
              showEmojis ? 'text-brand-600 bg-brand-50' : ''
            }`}
            title="Add Emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here... (Press Enter to send)"
            disabled={isSending}
            className="w-full pl-4 pr-12 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400 disabled:opacity-60"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 select-none">
            {text.length > 1500 ? `${text.length}/2000` : ''}
          </span>
        </div>

        <button
          type="submit"
          disabled={!text.trim() || isSending}
          className="p-3 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl shadow-md shadow-brand-500/20 disabled:shadow-none transition-all duration-150 flex items-center justify-center flex-shrink-0"
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
