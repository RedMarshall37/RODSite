// Файл axiosWithAuth.ts
import axios from 'axios';

const axiosWithAuth = axios.create({
  baseURL: 'http://localhost:5000',
});

axiosWithAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosWithAuth;
