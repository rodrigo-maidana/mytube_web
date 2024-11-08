// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://mytube.rodrigomaidana.com:8080/',
});

// Interceptor para incluir el token en las solicitudes (excepto /auth/)
axiosInstance.interceptors.request.use((config) => {
  if (!config.url.includes('/auth/')) {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.log('No se encontró token en localStorage');
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
