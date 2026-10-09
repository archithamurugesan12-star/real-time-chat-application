import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { getMessageDateDivider } from '../../utils/dateUtils';
import { MessageSquareDashed } from 'lucide-react';

export const MessageList = ({ messages = [], currentUser, receiverUser, isTyping = false }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-slate-50/50">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-4 shadow-sm">
          <MessageSquareDashed className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-slate-700 text-base">No messages yet</h3>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Say hello to <span className="font-semibold text-slate-600">{receiverUser?.name}</span> to start this conversation!
        </p>
      </div>
    );
  }

  // Render messages grouped with date dividers
  let lastDateStr = null;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1 bg-gradient-to-b from-slate-50/30 to-slate-100/40">
      {messages.map((msg, index) => {
        const msgDateStr = new Date(msg.createdAt).toDateString();
        const showDivider = msgDateStr !== lastDateStr;
        lastDateStr = msgDateStr;

        const senderId = msg.sender?._id || msg.sender;
        const isMe = senderId.toString() === currentUser?._id?.toString();

        return (
          <React.Fragment key={msg._id || index}>
            {showDivider && (
              <div className="flex items-center justify-center my-4">
                <span className="px-3 py-1 bg-white border border-slate-200/80 rounded-full text-[11px] font-semibold text-slate-500 shadow-2xs">
                  {getMessageDateDivider(msg.createdAt)}
                </span>
              </div>
            )}
            <MessageBubble
              message={msg}
              isMe={isMe}
              receiverUser={receiverUser}
            />
          </React.Fragment>
        );
      })}

      {/* Typing Indicator */}
      {isTyping && <TypingIndicator userName={receiverUser?.name || 'User'} />}

      {/* Anchor for autoscroll */}
      <div ref={bottomRef} className="h-1" />
    </div>
  );
};

export default MessageList;
