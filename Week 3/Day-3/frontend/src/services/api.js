  // src/services/api.js
  import axios from 'axios';

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: false,
  });

  // Attach token on each request
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Handle 401 globally
  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err?.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(err);
    }
  );

  // ---- Auth endpoints -- --
  export const authAPI = {
    login: async (email, password) => {
      const { data } = await api.post('/api/users/login', { email, password });
      return data; // expected { token, user? }
    },
    register: async (name, email, password) => {
      const { data } = await api.post('/api/users/register', { name, email, password });
      return data; // expected { token, user? }
    },
  };

  // ---- Task endpoints ----
  export const taskAPI = {
    list: async () => {
      const { data } = await api.get('/api/tasks');
      return data; // expected Task[]
    },
    create: async (payload) => {
      const { data } = await api.post('/api/tasks', payload);
      return data; // created task
    },
    update: async (id, payload) => {
      const { data } = await api.put(`/api/tasks/${id}`, payload);
      return data; // updated task
    },
    remove: async (id) => {
      const { data } = await api.delete(`/api/tasks/${id}`);
      return data; // e.g., { success: true }
    },
  };

  export default api;
