import React from 'react';
import { formatConversationTime } from '../../utils/dateUtils';
import { useSocket } from '../../context/SocketContext';
import Avatar from '../common/Avatar';

export const ConversationItem = ({
  conversation,
  currentUser,
  isActive,
  onClick,
}) => {
  const { checkIsOnline } = useSocket();

  const otherParticipant = conversation.participants?.find(
    (p) => p._id?.toString() !== currentUser?._id?.toString()
  );

  if (!otherParticipant) return null;

  const isOnline = checkIsOnline(otherParticipant._id) || otherParticipant.isOnline;
  const lastMessage = conversation.lastMessage;
  const unreadCount = conversation.unreadCount || 0;

  // Format last message text
  let lastMessageText = 'No messages yet';
  let isSenderMe = false;

  if (lastMessage) {
    if (typeof lastMessage === 'object') {
      lastMessageText = lastMessage.text || '';
      const senderId = lastMessage.sender?._id || lastMessage.sender;
      isSenderMe = senderId?.toString() === currentUser?._id?.toString();
    } else {
      lastMessageText = String(lastMessage);
    }
  }

  const timeDisplay = formatConversationTime(
    lastMessage?.createdAt || conversation.lastMessageAt || conversation.updatedAt
  );

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-150 relative select-none ${
        isActive
          ? 'bg-brand-50 text-slate-900 shadow-xs border border-brand-200/60'
          : 'hover:bg-slate-100/80 text-slate-700'
      }`}
    >
      {/* Avatar with live status */}
      <Avatar
        src={otherParticipant.avatar}
        name={otherParticipant.name}
        size="md"
        isOnline={isOnline}
        showStatus={true}
      />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <h4
            className={`text-sm font-semibold truncate ${
              isActive ? 'text-brand-900' : 'text-slate-800'
            }`}
          >
            {otherParticipant.name}
          </h4>
          <span
            className={`text-[11px] font-medium flex-shrink-0 ${
              unreadCount > 0 ? 'text-brand-600 font-bold' : 'text-slate-400'
            }`}
          >
            {timeDisplay}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-xs truncate ${
              unreadCount > 0
                ? 'font-bold text-slate-900'
                : isActive
                ? 'text-brand-700'
                : 'text-slate-500'
            }`}
          >
            {isSenderMe ? <span className="text-slate-400 font-normal">You: </span> : null}
            {lastMessageText}
          </p>

          {unreadCount > 0 && (
            <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
