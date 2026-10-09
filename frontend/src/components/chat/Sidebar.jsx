import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Settings, LogOut, MessageSquare, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useSocket } from '../../context/SocketContext';
import Avatar from '../common/Avatar';
import ConversationList from './ConversationList';

export const Sidebar = ({ onOpenSearch, className = '' }) => {
  const { user, logout, isAdmin } = useAuth();
  const {
    conversations,
    activeConversation,
    loadingConversations,
    selectConversation,
  } = useChat();
  const { isSocketConnected } = useSocket();

  return (
    <aside
      className={`w-full md:w-80 lg:w-96 bg-white border-r border-slate-200/90 flex flex-col h-full z-20 ${className}`}
    >
      {/* Current User Header Bar */}
      <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
        <Link to="/profile" className="flex items-center gap-3 min-w-0 group">
          <Avatar
            src={user?.avatar}
            name={user?.name}
            size="md"
            isOnline={isSocketConnected}
            showStatus={true}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-slate-800 group-hover:text-brand-600 transition-colors truncate">
                {user?.name}
              </h3>
              {isAdmin && (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  Admin
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSocketConnected ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
              {isSocketConnected ? 'Connected' : 'Connecting...'}
            </p>
          </div>
        </Link>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 text-slate-400">
          <Link
            to="/profile"
            className="p-2 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            title="Profile Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={logout}
            className="p-2 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Start Chat Button */}
      <div className="p-3 border-b border-slate-100">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-brand-500/20 transition-all active:scale-98"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Conversation List */}
      <ConversationList
        conversations={conversations}
        activeConversation={activeConversation}
        currentUser={user}
        loading={loadingConversations}
        onSelectConversation={selectConversation}
        onOpenSearch={onOpenSearch}
      />
    </aside>
  );
};

export default Sidebar;
