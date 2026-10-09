import React from 'react';
import { MessageSquare, Users, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import LoadingSpinner from '../common/LoadingSpinner';

export const ChatArea = ({ onOpenSearch, onBackClick }) => {
  const { user } = useAuth();
  const {
    activeConversation,
    messages,
    loadingMessages,
    typingMap,
    setActiveConversation,
  } = useChat();

  if (!activeConversation) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 bg-slate-50/60 text-center relative overflow-hidden">
        {/* Background ambient accents */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xl shadow-slate-200/50 flex flex-col items-center z-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-600 to-accent flex items-center justify-center text-white shadow-lg shadow-brand-500/30 mb-6 group transition-transform hover:scale-105">
            <MessageSquare className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Welcome to <span className="text-brand-600">ConnectHub</span>
          </h2>
          <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
            Select an existing conversation from the sidebar or find colleagues to start exchanging messages instantly.
          </p>

          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-2xl shadow-md shadow-brand-500/25 transition-all transform active:scale-98"
          >
            <Users className="w-5 h-5" />
            <span>Find People to Chat</span>
          </button>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-3 mt-8 w-full text-left">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span className="text-xs font-medium text-slate-700">Real-Time Messaging</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="text-xs font-medium text-slate-700">End-to-End JWT Auth</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const receiverUser = activeConversation.participants?.find(
    (p) => p._id?.toString() !== user?._id?.toString()
  );

  const isReceiverTyping =
    receiverUser &&
    typingMap[activeConversation._id] &&
    typingMap[activeConversation._id][receiverUser._id];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header */}
      <ChatHeader
        receiverUser={receiverUser}
        onBackClick={() => {
          setActiveConversation(null);
          if (onBackClick) onBackClick();
        }}
      />

      {/* Message Area */}
      {loadingMessages ? (
        <div className="flex-1 flex items-center justify-center bg-slate-50/50">
          <LoadingSpinner size="md" text="Loading chat history..." />
        </div>
      ) : (
        <MessageList
          messages={messages}
          currentUser={user}
          receiverUser={receiverUser}
          isTyping={Boolean(isReceiverTyping)}
        />
      )}

      {/* Message Input Bar */}
      <MessageInput />
    </div>
  );
};

export default ChatArea;
