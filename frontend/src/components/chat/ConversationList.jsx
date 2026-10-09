import React, { useState } from 'react';
import { Search, MessagesSquare, UserPlus } from 'lucide-react';
import ConversationItem from './ConversationItem';
import LoadingSpinner from '../common/LoadingSpinner';

export const ConversationList = ({
  conversations = [],
  activeConversation,
  currentUser,
  loading,
  onSelectConversation,
  onOpenSearch,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredConversations = conversations.filter((conv) => {
    if (!filterQuery.trim()) return true;
    const otherParticipant = conv.participants?.find(
      (p) => p._id?.toString() !== currentUser?._id?.toString()
    );
    if (!otherParticipant) return false;
    return (
      otherParticipant.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      otherParticipant.email.toLowerCase().includes(filterQuery.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <LoadingSpinner size="md" text="Loading chats..." />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Quick Search Filter */}
      {conversations.length > 0 && (
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter conversations..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      )}

      {/* Conversations Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => {
            const isActive = activeConversation?._id === conv._id;
            return (
              <ConversationItem
                key={conv._id}
                conversation={conv}
                currentUser={currentUser}
                isActive={isActive}
                onClick={() => onSelectConversation(conv)}
              />
            );
          })
        ) : conversations.length > 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No conversations match "{filterQuery}"
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
              <MessagesSquare className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-700 text-sm">No conversations yet</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
              Find and connect with users to start messaging.
            </p>
            <button
              type="button"
              onClick={onOpenSearch}
              className="mt-4 flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-brand-600 text-white rounded-xl hover:bg-brand-700 shadow-sm shadow-brand-500/20 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Find Users</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
