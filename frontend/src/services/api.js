const API_BASE_URL = '/api';

const getToken = () => localStorage.getItem('token');

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  auth: {
    login: (credentials) =>
      request('/auth/login', { method: 'POST', body: credentials }),
    register: (userData) =>
      request('/auth/register', { method: 'POST', body: userData }),
    getMe: () => request('/auth/me'),
    updateProfile: (profileData) =>
      request('/auth/profile', { method: 'PUT', body: profileData }),
  },
  pets: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value);
        }
      });
      const queryString = searchParams.toString();
      return request(`/pets${queryString ? `?${queryString}` : ''}`);
    },
    getFeatured: () => request('/pets/featured'),
    getById: (id) => request(`/pets/${id}`),
    create: (petData) =>
      request('/pets', { method: 'POST', body: petData }),
    update: (id, petData) =>
      request(`/pets/${id}`, { method: 'PUT', body: petData }),
    delete: (id) =>
      request(`/pets/${id}`, { method: 'DELETE' }),
  },
  applications: {
    create: (appData) =>
      request('/applications', { method: 'POST', body: appData }),
    getMy: () => request('/applications/my'),
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams(params);
      const query = searchParams.toString();
      return request(`/applications${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/applications/${id}`),
    updateStatus: (id, statusData) =>
      request(`/applications/${id}/status`, { method: 'PATCH', body: statusData }),
  },
  chat: {
    getConversations: () => request('/chat/conversations'),
    getOrCreateConversation: (data) =>
      request('/chat/conversations', { method: 'POST', body: data }),
    getMessages: (conversationId) =>
      request(`/chat/conversations/${conversationId}/messages`),
    sendMessage: (conversationId, text) =>
      request(`/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: { text },
      }),
  },
  notifications: {
    getAll: () => request('/notifications'),
    markAsRead: (id) =>
      request(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllAsRead: () =>
      request('/notifications/read-all', { method: 'PATCH' }),
  },
  stats: {
    getAdminStats: () => request('/stats'),
  },
};
