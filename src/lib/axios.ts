// src/lib/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use .env for env-specific URLs
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Optional: Add auth token interceptor
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
