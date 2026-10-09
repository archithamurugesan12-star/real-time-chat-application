import api from './api';

export const messageService = {
  getMessages: async (conversationId) => {
    const response = await api.get(`/messages/${conversationId}`);
    return response.data;
  },

  sendMessage: async ({ conversationId, receiverId, text }) => {
    const response = await api.post('/messages', {
      conversationId,
      receiverId,
      text,
    });
    return response.data;
  },

  markMessageAsRead: async (messageId) => {
    const response = await api.put(`/messages/${messageId}/read`);
    return response.data;
  },

  markAllMessagesAsRead: async (conversationId) => {
    const response = await api.put('/messages/read/all', { conversationId });
    return response.data;
  },
};

export default messageService;
