import api from './api';

export const conversationService = {
  getConversations: async () => {
    const response = await api.get('/conversations');
    return response.data;
  },

  createOrGetConversation: async (recipientId) => {
    const response = await api.post('/conversations', { recipientId });
    return response.data;
  },

  getConversationById: async (id) => {
    const response = await api.get(`/conversations/${id}`);
    return response.data;
  },
};

export default conversationService;
