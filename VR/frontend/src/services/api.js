/**
 * API service for Project Sentinel
 * Handles all HTTP requests to the backend API
 */

import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication API calls
 */
export const authAPI = {
  // User login
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  // User registration
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

/**
 * Session management API calls
 */
export const sessionAPI = {
  // Get all user sessions
  getSessions: async () => {
    const response = await api.get('/sessions');
    return response.data.sessions;
  },

  // Get specific session with full data
  getSession: async (sessionId) => {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data.session;
  },

  // Create new session
  createSession: async (sessionData) => {
    const response = await api.post('/sessions', sessionData);
    return response.data.session;
  },

  // End session
  endSession: async (sessionId) => {
    const response = await api.put(`/sessions/${sessionId}/end`);
    return response.data.session;
  },
};

/**
 * AI analysis API calls
 */
export const analysisAPI = {
  // Analyze session data
  analyzeSession: async (sessionData) => {
    const aiServiceUrl = process.env.NODE_ENV === 'production' ? 'http://localhost:5000' : 'http://localhost:5000';
    const response = await axios.post(`${aiServiceUrl}/analyze`, sessionData);
    return response.data;
  },
};

export default api;