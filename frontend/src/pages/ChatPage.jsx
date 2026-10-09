import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import Sidebar from '../components/chat/Sidebar';
import ChatArea from '../components/chat/ChatArea';
import UserSearchModal from '../components/chat/UserSearchModal';

export const ChatPage = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { activeConversation, setActiveConversation } = useChat();

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden">
      <div className="flex-1 flex w-full h-full overflow-hidden">
        {/* Sidebar: Visible on desktop or when no conversation is active on mobile */}
        <Sidebar
          onOpenSearch={() => setIsSearchModalOpen(true)}
          className={activeConversation ? 'hidden md:flex' : 'flex'}
        />

        {/* Chat Area: Visible on desktop or when active conversation is selected on mobile */}
        <div
          className={`flex-1 h-full overflow-hidden ${
            activeConversation ? 'flex' : 'hidden md:flex'
          }`}
        >
          <ChatArea
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onBackClick={() => setActiveConversation(null)}
          />
        </div>
      </div>

      {/* User Search & New Conversation Modal */}
      <UserSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </div>
  );
};

export default ChatPage;
