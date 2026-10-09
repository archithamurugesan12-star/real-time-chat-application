import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { formatMessageTime } from '../../utils/dateUtils';
import Avatar from '../common/Avatar';

export const MessageBubble = ({ message, isMe, receiverUser }) => {
  const isRead =
    message.readBy &&
    receiverUser &&
    message.readBy.some(
      (id) => (id._id ? id._id.toString() : id.toString()) === (receiverUser._id ? receiverUser._id.toString() : receiverUser.toString())
    );

  return (
    <div
      className={`flex items-end gap-2 w-full my-1 animate-message ${
        isMe ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Received Message Sender Avatar */}
      {!isMe && (
        <Avatar
          src={message.sender?.avatar}
          name={message.sender?.name || 'User'}
          size="sm"
          className="mb-1"
        />
      )}

      {/* Bubble Container */}
      <div
        className={`max-w-[75%] sm:max-w-[65%] md:max-w-[55%] rounded-2xl px-4 py-2.5 shadow-2xs relative group transition-all duration-150 ${
          isMe
            ? 'bg-gradient-to-tr from-brand-600 to-brand-500 text-white rounded-br-xs'
            : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs'
        }`}
      >
        {/* Message Text */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words font-normal">
          {message.text}
        </p>

        {/* Message Footer: Time + Read Status */}
        <div
          className={`flex items-center justify-end gap-1 mt-1 text-[10px] select-none ${
            isMe ? 'text-brand-100/90' : 'text-slate-400'
          }`}
        >
          <span>{formatMessageTime(message.createdAt)}</span>

          {isMe && (
            <span title={isRead ? 'Read' : 'Delivered'} className="inline-flex">
              {isRead ? (
                <CheckCheck className="w-3.5 h-3.5 text-accent-light" />
              ) : (
                <Check className="w-3.5 h-3.5 text-brand-200" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
