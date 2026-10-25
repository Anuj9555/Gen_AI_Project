import axios from 'axios';

const getApiBaseUrl = (): string => {
  let url = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1').trim();
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/api/v1')) {
    url = `${url}/api/v1`;
  }
  return url;
};

export const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const sessionStr = localStorage.getItem('wanderai_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`;
        }
      } catch {
        // ignore parse error
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired or invalid
      // Do not clear immediately on initial check
    }
    return Promise.reject(error);
  }
);
