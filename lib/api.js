import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
};

// Recipe APIs
export const recipeAPI = {
  getAll: () => api.get('/recipes'),
  getById: (id) => api.get(`/recipes/${id}`),
  create: (recipeData) => api.post('/recipes', recipeData),
  update: (id, recipeData) => api.put(`/recipes/${id}`, recipeData),
  delete: (id) => api.delete(`/recipes/${id}`),
  search: (keyword) => api.get(`/recipes/search?keyword=${keyword}`),
  getByCategory: (categoryId) => api.get(`/recipes/category/${categoryId}`),
  getByUser: (userId) => api.get(`/recipes/user/${userId}`),
};

// Category APIs
export const categoryAPI = {
  getAll: () => api.get('/categories'),
};

// Tag APIs
export const tagAPI = {
  getAll: () => api.get('/tags'),
};

export default api;