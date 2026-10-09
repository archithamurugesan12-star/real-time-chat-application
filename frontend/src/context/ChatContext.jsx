import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import conversationService from '../services/conversationService';
import messageService from '../services/messageService';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import toast from 'react-hot-toast';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [typingMap, setTypingMap] = useState({}); // { [conversationId]: { [userId]: boolean } }

  // Load user conversations
  const loadConversations = useCallback(async () => {
    if (!user) return;
    setLoadingConversations(true);
    try {
      const data = await conversationService.getConversations();
      if (data.success) {
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('[ChatContext] Failed to load conversations:', error.message);
    } finally {
      setLoadingConversations(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadConversations();
    } else {
      setConversations([]);
      setActiveConversation(null);
      setMessages([]);
    }
  }, [user, loadConversations]);

  // Load messages when activeConversation changes
  const loadMessages = useCallback(async (convId) => {
    if (!convId) return;
    setLoadingMessages(true);
    try {
      const data = await messageService.getMessages(convId);
      if (data.success) {
        setMessages(data.messages || []);
        // Automatically mark unread messages as read
        await messageService.markAllMessagesAsRead(convId);

        // Update local conversation unread count to 0
        setConversations((prev) =>
          prev.map((c) => (c._id === convId ? { ...c, unreadCount: 0 } : c))
        );
      }
    } catch (error) {
      console.error('[ChatContext] Failed to load messages:', error.message);
      toast.error('Could not load chat history');
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Select conversation helper
  const selectConversation = useCallback(
    (conv) => {
      setActiveConversation(conv);
      if (conv?._id) {
        loadMessages(conv._id);
        if (socket && user) {
          const otherParticipant = conv.participants?.find((p) => p._id !== user._id);
          if (otherParticipant) {
            socket.emit('message:read', {
              conversationId: conv._id,
              senderId: otherParticipant._id,
            });
          }
        }
      }
    },
    [loadMessages, socket, user]
  );

  // Start or open conversation with a specific user
  const startConversationWithUser = async (targetUser) => {
    try {
      const data = await conversationService.createOrGetConversation(targetUser._id);
      if (data.success && data.conversation) {
        const conv = data.conversation;
        setConversations((prev) => {
          const exists = prev.find((c) => c._id === conv._id);
          if (exists) {
            return prev.map((c) => (c._id === conv._id ? conv : c));
          }
          return [conv, ...prev];
        });
        selectConversation(conv);
        return { success: true, conversation: conv };
      }
    } catch (error) {
      toast.error(error.message || 'Failed to start conversation');
      return { success: false, error: error.message };
    }
  };

  // Send a message
  const sendMessage = async (text) => {
    if (!text || !text.trim() || !activeConversation || !user) return;
    setIsSending(true);

    const otherParticipant = activeConversation.participants?.find(
      (p) => p._id.toString() !== user._id.toString()
    );

    if (!otherParticipant) {
      toast.error('Recipient not found');
      setIsSending(false);
      return;
    }

    try {
      const data = await messageService.sendMessage({
        conversationId: activeConversation._id,
        receiverId: otherParticipant._id,
        text: text.trim(),
      });

      if (data.success && data.message) {
        // Message will also arrive or update via socket or local state
        setMessages((prev) => {
          if (prev.some((m) => m._id === data.message._id)) return prev;
          return [...prev, data.message];
        });

        // Update conversation list item
        setConversations((prev) =>
          prev.map((c) => {
            if (c._id === activeConversation._id) {
              return {
                ...c,
                lastMessage: data.message,
                lastMessageAt: data.message.createdAt,
              };
            }
            return c;
          })
        );
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  // Emit typing indicator
  const emitTyping = (isTyping) => {
    if (!socket || !activeConversation || !user) return;
    const otherParticipant = activeConversation.participants?.find(
      (p) => p._id.toString() !== user._id.toString()
    );
    if (!otherParticipant) return;

    if (isTyping) {
      socket.emit('typing:start', {
        conversationId: activeConversation._id,
        receiverId: otherParticipant._id,
      });
    } else {
      socket.emit('typing:stop', {
        conversationId: activeConversation._id,
        receiverId: otherParticipant._id,
      });
    }
  };

  // Setup Socket.IO Event Listeners
  useEffect(() => {
    if (!socket || !user) return;

    // 1. New Message Received
    const handleNewMessage = (newMessage) => {
      // Check if message belongs to currently open conversation
      if (activeConversation && activeConversation._id === newMessage.conversation) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });

        // Mark as read if user is receiver
        if (newMessage.receiver?._id === user._id || newMessage.receiver === user._id) {
          socket.emit('message:read', {
            conversationId: activeConversation._id,
            senderId: newMessage.sender?._id || newMessage.sender,
          });
          messageService.markAllMessagesAsRead(activeConversation._id).catch(() => {});
        }
      } else {
        // Show notification toast if from another user
        const senderName = newMessage.sender?.name || 'Someone';
        if (newMessage.sender?._id !== user._id && newMessage.sender !== user._id) {
          toast(`💬 ${senderName}: ${newMessage.text.slice(0, 40)}`, {
            duration: 4000,
            position: 'top-right',
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              borderRadius: '12px',
            },
          });
        }
      }

      // Update conversation list preview & unread badge
      setConversations((prev) => {
        let matched = false;
        const updated = prev.map((conv) => {
          if (conv._id === newMessage.conversation) {
            matched = true;
            const isCurrentlyActive = activeConversation?._id === conv._id;
            const isFromOther = (newMessage.sender?._id || newMessage.sender) !== user._id;
            return {
              ...conv,
              lastMessage: newMessage,
              lastMessageAt: newMessage.createdAt,
              unreadCount: !isCurrentlyActive && isFromOther ? (conv.unreadCount || 0) + 1 : conv.unreadCount,
            };
          }
          return conv;
        });

        if (!matched) {
          // If conversation wasn't loaded yet, reload
          loadConversations();
        }

        // Sort by lastMessageAt descending
        return updated.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
      });
    };

    // 2. Typing Indicator Update
    const handleTypingUpdate = ({ conversationId, userId: typingUserId, isTyping }) => {
      setTypingMap((prev) => ({
        ...prev,
        [conversationId]: {
          ...(prev[conversationId] || {}),
          [typingUserId]: isTyping,
        },
      }));
    };

    // 3. Message Read Receipts Update
    const handleMessageReadUpdate = ({ conversationId, readerId }) => {
      if (activeConversation && activeConversation._id === conversationId) {
        setMessages((prev) =>
          prev.map((msg) => {
            if (!msg.readBy.includes(readerId)) {
              return { ...msg, readBy: [...msg.readBy, readerId] };
            }
            return msg;
          })
        );
      }
    };

    // 4. Conversation Update
    const handleConversationUpdate = (updatedConv) => {
      setConversations((prev) => {
        const exists = prev.some((c) => c._id === updatedConv._id);
        if (!exists) {
          return [updatedConv, ...prev];
        }
        return prev.map((c) => (c._id === updatedConv._id ? { ...c, ...updatedConv } : c));
      });
    };

    socket.on('message:new', handleNewMessage);
    socket.on('typing:update', handleTypingUpdate);
    socket.on('message:read:update', handleMessageReadUpdate);
    socket.on('conversation:update', handleConversationUpdate);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('typing:update', handleTypingUpdate);
      socket.off('message:read:update', handleMessageReadUpdate);
      socket.off('conversation:update', handleConversationUpdate);
    };
  }, [socket, user, activeConversation, loadConversations]);

  const value = {
    conversations,
    activeConversation,
    messages,
    loadingConversations,
    loadingMessages,
    isSending,
    typingMap,
    loadConversations,
    selectConversation,
    startConversationWithUser,
    sendMessage,
    emitTyping,
    setActiveConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;
