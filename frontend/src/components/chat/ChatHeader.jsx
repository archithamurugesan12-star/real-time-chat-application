import React from 'react';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { formatLastSeen } from '../../utils/dateUtils';
import { useSocket } from '../../context/SocketContext';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';

export const ChatHeader = ({ receiverUser, onBackClick }) => {
  const { checkIsOnline } = useSocket();

  if (!receiverUser) return null;

  const isOnline = checkIsOnline(receiverUser._id) || receiverUser.isOnline;
  const statusText = formatLastSeen(receiverUser.lastSeen, isOnline);

  return (
    <div className="px-4 sm:px-6 py-3.5 bg-white border-b border-slate-200/90 flex items-center justify-between shadow-2xs z-10">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        <button
          type="button"
          onClick={onBackClick}
          className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="Back to conversation list"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* User Avatar */}
        <Avatar
          src={receiverUser.avatar}
          name={receiverUser.name}
          size="md"
          isOnline={isOnline}
          showStatus={true}
        />

        {/* User Name & Status */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-800 text-sm sm:text-base truncate">
              {receiverUser.name}
            </h2>
            <StatusBadge isOnline={isOnline} showLabel={false} />
          </div>
          <p className="text-xs text-slate-500 truncate flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
              }`}
            />
            {statusText}
            {receiverUser.bio && (
              <span className="hidden sm:inline text-slate-400"> • {receiverUser.bio}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
