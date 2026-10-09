import api from './api';

export const userService = {
  searchUsers: async (query = '') => {
    const response = await api.get(`/users?search=${encodeURIComponent(query)}`);
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};

export default userService;
